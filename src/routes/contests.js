const express = require("express")
const userAuth = require("../middlewares/auth")
const Contest = require("../models/Contest")
const contestsFromApi = require("../utils/contestsFromApi")
const contestRouter = express.Router()

contestRouter.get("/contests/platform/:platform",async(req,res) => {
    try{
        const {startDate,endDate} = req.query
        
        const {platform} = req.params

       // Dont need to even call the api 

        // Made a DB find based on the platform preferences
                    
        let contestsFromDB ;
        
        
        if(platform !== "all") contestsFromDB = await Contest.find({platform : platform})
        else contestsFromDB = await Contest.find({})

        if(startDate) {
            const start = new Date(startDate)
            contestsFromDB = contestsFromDB.filter((item) => new Date(item.contestStartDate) >= start)
        }
        if(endDate) {
            const end = new Date(endDate)
            contestsFromDB = contestsFromDB.filter((item) => new Date(item.contestEndDate) <= end)
        }

        // Sorted the contests
        contestsFromDB.sort((a, b) => new Date(a.contestStartDate) - new Date(b.contestStartDate));

    
        res.json({
            message : "Contests Fetched Successfully",
            data : contestsFromDB 
        })


    }catch(err){
        res.status(401).send("Failed to fetch the contests : " + err)
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

