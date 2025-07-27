const express = require("express")
const userAuth = require("../middlewares/auth")
const Contest = require("../models/Contest")
const contestRouter = express.Router()

contestRouter.get("/contests/:platform",async(req,res) => {
    try{
        
        const {platform} = req.params
        const apiResponse = await fetch(process.env.CONTESTS_API)
        const apiResponseJson = await apiResponse.json()
        // Put this data in DB
        
        for(contest of apiResponseJson.data){
            const {contestCode} = contest
          await Contest.findOneAndUpdate({contestCode},contest,{upsert : true,new : true})
        }

        // Make a DB find based on the platform preferences
        
        let contestsFromDB ;
        
        
        if(platform !== "all") contestsFromDB = await Contest.find({platform : platform})
        else contestsFromDB = await Contest.find({})

        res.json({
            message : "Contests Fetched Successfully",
            data : contestsFromDB 
        })


    }catch(err){
        res.status(401).send("Failed to fetch the contests : " + err)
    }
})

module.exports = contestRouter

