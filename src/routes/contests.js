const express = require("express")
const userAuth = require("../middlewares/auth")
const Contest = require("../models/Contest")
const contestsFromApi = require("../utils/contestsFromApi")
const  mongoose = require("mongoose")
const User = require("../models/user")
const agenda = require("../utils/agenda")

const contestRouter = express.Router()

contestRouter.get("/contests/platform/",async(req,res) => {
    try{
        const {startDate,endDate} = req.query
        const {platforms} = req.query
        
        
        const filteredPlatforms = platforms.split(",")

       // Dont need to even call the api 

        // Made a DB find based on the platform preferences
                    
        let contestsFromDB ;
        
        
        if(filteredPlatforms.length > 0) contestsFromDB = await Contest.find({platform :{$in : filteredPlatforms}}).sort({contestStartDate : 1})
        else contestsFromDB = await Contest.find({}).sort({contestStartDate : 1})

        if(startDate) {
            const start = new Date(startDate)
            contestsFromDB = contestsFromDB.filter((item) => new Date(item.contestStartDate) >= start)
        }
        if(endDate) {
            const end = new Date(endDate)
            contestsFromDB = contestsFromDB.filter((item) => new Date(item.contestEndDate) <= end)
        }

        // Sorted the contests
        //  contestsFromDB.sort((a, b) => new Date(a.contestStartDate) - new Date(b.contestStartDate));

    
        res.json({
            message : "Contests Fetched Successfully",
            data : contestsFromDB 
        })


    }catch(err){
        res.status(401).send("Failed to fetch the contests : " + err)
    }
})

contestRouter.get("/contests/platform/:platform",async(req,res) => {
    try{
        const {startDate,endDate} = req.query
        
        const {platform} = req.params

       // Dont need to even call the api 

        // Made a DB find based on the platform preferences
                    
        let contestsFromDB ;
        
        
        if(platform !== "all") contestsFromDB = await Contest.find({platform : platform}).sort({contestStartDate : 1})
        else contestsFromDB = await Contest.find({}).sort({contestStartDate : 1})

        if(startDate) {
            const start = new Date(startDate)
            contestsFromDB = contestsFromDB.filter((item) => new Date(item.contestStartDate) >= start)
        }
        if(endDate) {
            const end = new Date(endDate)
            contestsFromDB = contestsFromDB.filter((item) => new Date(item.contestEndDate) <= end)
        }

        // Sorted the contests
        //  contestsFromDB.sort((a, b) => new Date(a.contestStartDate) - new Date(b.contestStartDate));

    
        res.json({
            message : "Contests Fetched Successfully",
            data : contestsFromDB 
        })


    }catch(err){
        res.status(401).send("Failed to fetch the contests : " + err)
    }
})

contestRouter.get("/get-upcoming-contests/:platform",async(req,res) => {
    try {
        const {platform} = req.params
    const response = await fetch(process.env.UPCOMING_CONTESTS_API)
    const responseJSON = await response.json()
    
    for(const contest of responseJSON.data){
        const {contestCode} = contest
        await Contest.findOneAndUpdate({contestCode},contest,{upsert : true,new : true})
    }
    let contestsFromDB;
    if(platform !== "all") contestsFromDB = await Contest.find({platform : platform}).sort({contestStartDate :1})
        else contestsFromDB = await Contest.find({}).sort({contestStartDate :1})

        res.json({
            message : "🚀Upcoming Contests Fetched Successfully",
            data : contestsFromDB
        })

    }

    catch(err){
        res.status(401).send("Failed to fetch the upcoming contests : "+ err)
    }
})

contestRouter.get("/contests/day/:date",async(req,res) => {
    try{
      
    const {date} = req.params;
    const dateOnly = new Date(date);
    const {platform}  = req.query;

    if(!date || isNaN(new Date(dateOnly.getTime()))) throw new Error("Invalid Date , Please Correct your URL")
        const startDate = new Date(dateOnly);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(dateOnly);
    endDate.setHours(23, 59, 59, 999);
    
        

         let contestsFromDB;
        if(platform && platform !== "all")  contestsFromDB = await Contest.find({ $and :[{ contestStartDate :{ $gte : startDate, $lte : endDate}} ,{platform : platform} ]})
            else contestsFromDB = await Contest.find({contestStartDate :{ $gte : startDate, $lte : endDate}})
         
         
            res.json({
                message : "Contests Fetched Successfully for the Date " + date,
                data : contestsFromDB 
            })

    }catch(err){
        res.status(401).send("Failed to get Contests on Date :" + req?.params?.date + "Reason :" + err)
    }
       

})



module.exports = contestRouter

