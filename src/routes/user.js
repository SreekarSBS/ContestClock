const express = require("express")
const userAuth = require("../middlewares/auth")
const User = require("../models/user")
const userRouter = express.Router()

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
        const users = new User({
            uid,
            name,
            email,
            picture
        })

        const savedUser = await users.save()

        res.json({
            message : "User Fetched Successfully",
            data : savedUser 
        })


    }catch(err){
        res.status(401).send("Failed to fetch the user : " + err)
    }
})

module.exports = userRouter

