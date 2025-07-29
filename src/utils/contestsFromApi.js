const  mongoose = require("mongoose");
const Contest = require("../models/Contest")

async function contestsFromApi(){
    const apiResponse = await fetch(process.env.CONTESTS_API)
        const apiResponseJson = await apiResponse.json()
        // Put this data in DB
        console.log(apiResponseJson);
        
        for(const contest of apiResponseJson.data){
            const {contestCode} = contest
          await Contest.findOneAndUpdate({contestCode},contest,{upsert : true,new : true})
        }
}

module.exports = contestsFromApi