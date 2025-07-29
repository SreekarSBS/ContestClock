const express = require("express")
const userAuth = require("../middlewares/auth")
const User = require("../models/user")
const userRouter = express.Router()
const mongoose = require("mongoose")
const Contest = require("../models/Contest")

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
        }).populate("savedContests",CONTEST_DATA)
        
        
        if(!savedUser || savedUser == {}) throw new Error("Please add the authorised User in DB")
        
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
        
        const contestData = await User.findOne({uid :uid}).populate("savedContests",CONTEST_DATA)
        console.log(contestData);
        
        res.json({
            message : "🚀Contest saved Successfully for " + req.user.name,
            data : contestData
        })
    }catch(err){
        res.status(401).send(err)
    }
})

module.exports = userRouter

