const express = require("express")
const userAuth = require("../middlewares/auth")
const User = require("../models/user")
const userRouter = express.Router()
const mongoose = require("mongoose")
const Contest = require("../models/Contest")
const agenda = require("../utils/agenda")


// Save the user in Client as soon as authorised
userRouter.get("/user",userAuth,async(req,res) => {
    try{
        if(!req.user) throw new Error("Invalid Firebase Token")
        // I will save the user in the DB for further populations for contests and return it as well

        const {
            uid,
            name,
            email,
            picture
        } = req.user
        // One object to create the Document and the other for returning after saving it in DB
        let userDocument = await User.findOne({uid})
        if(!userDocument){
        const users = new User({
            uid,
            name,
            email,
            picture
        })
       userDocument = await users.save()
    }

        res.json({
            message : "User Fetched Successfully",
            data : userDocument 
        })


    }catch(err){
        res.status(401).send("Failed to fetch the user : " + err)
    }
})
const CONTEST_DATA = "contestCode contestDuration contestEndDate contestName contestRegistrationEndDate contestRegistrationStartDate contestSlug contestStartDate contestType contestUrl platform"

userRouter.post("/user/saveContests/:contestId",userAuth,async(req,res) => {
    try{
        const {uid} = req.user
        console.log(req.user);
        
        console.log(uid);
        
        if(!uid || !req.user) throw new Error("Login to Continue")
        const {contestId} = req.params
        
        const contestDocument = await Contest.findById(contestId)
        
        if(!contestDocument) throw new Error("Contest not found")
        console.log(contestDocument);
        
        const savedUser = await User.findOneAndUpdate({uid : uid},{
            $addToSet : { savedContests : contestDocument._id }
        },{new : true}).populate({
            select: CONTEST_DATA,
            path: "savedContests",
            match : {contestEndDate : {$gte : new Date()} },
            options: { sort: { contestStartDate: 1 } }, 
            
        })
        
        
        if(!savedUser || savedUser == {}) throw new Error("Please add the authorised User in DB")
        
             const reminderTime = new Date(new Date(contestDocument.contestStartDate).getTime() - 60 * 60 * 1000);
             if (reminderTime > new Date()) {
              await agenda.schedule(reminderTime, "send contest reminder", {
                userId: savedUser.uid,
                email: savedUser.email,
                contestId: contestDocument._id,
                contestName: contestDocument.contestName,
                contestUrl: contestDocument.contestUrl,
                platform: contestDocument.platform,
                hoursBefore : 1
              });
             }

        res.json({
            message : "🚀Contest saved Successfully for " + savedUser.name,
            data : savedUser
        })
    }
    catch(err){
        res.status(401).send(err)
    }
})

userRouter.get("/user/registeredContests",userAuth,async(req,res) => {
    try{
        const {uid} = req.user
        console.log(uid);
        
        
        if(!uid || !req.user) throw new Error("Login to Continue")
        
        const contestData = await User.findOne({uid :uid}).populate({
            select: CONTEST_DATA,
            path: "savedContests",
            match : {contestEndDate : {$gte : new Date()} },
            options: { sort: { contestStartDate: 1 } }, 
            
        })

        console.log(contestData);
        
        
        res.json({
            message : "🚀Contest saved Successfully for " + req.user.name,
            data : contestData
        })
    }catch(err){
        res.status(401).send(err)
    }
})

userRouter.delete("/user/deleteContests/:contestId",userAuth,async(req,res) => {
    try {
    const {uid} = req.user;
    if(!uid) throw new Error("Please Login to continue")
    const {contestId} = req.params
    if(!contestId) throw new Error("Contest Doesnt Exist , Null contestId")
    
    const userWithFilteredContests = await User.findOneAndUpdate({uid : uid},{
        
        $pull : {
            savedContests : contestId
        }},{
            new : true
        }
    ).populate({
        path: "savedContests",
        match: { contestEndDate: { $gte: new Date() } },
        select: CONTEST_DATA,
        options: { sort: { contestStartDate: 1 } },
      });

    await agenda.cancel({
        name: 'send contest reminder',
        'data.userId': uid,
        'data.contestId': contestId
      });
      

    res.json({
        message : "Contest Unregistered Successfully",
        data : userWithFilteredContests
    })
}catch(err){
    console.log(err);
}
})

module.exports = userRouter

