const  mongoose = require("mongoose");
const Contest = require("../models/Contest")

async function contestsFromApi(){
  try {
    const apiResponse = await fetch(process.env.CONTESTS_API)
        const apiResponseJson = await apiResponse.json()
        // Put this data in DB
       
        
        console.log(apiResponseJson);
          
        for(const contest of apiResponseJson.data){
          const {
            contestCode,
            contestDuration,
            contestEndDate,
            contestName,
            contestRegistrationEndDate,
            contestRegistrationStartDate,
            contestSlug,
            contestStartDate,
            contestType,
            contestUrl,
            platform
        } = contest;
    
        const updateData = {
            contestDuration,
            contestEndDate,
            contestName,
            contestRegistrationEndDate,
            contestRegistrationStartDate,
            contestSlug,
            contestStartDate,
            contestType,
            contestUrl,
            platform
        };
    
         
        await Contest.findOneAndUpdate({contestCode},{ $set : updateData},{upsert : true,new : true})
       
      }
      console.log("Contests from API response:");
      }catch(err){
        console.log(err);
        
      }
}

module.exports = contestsFromApi