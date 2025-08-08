const Contest = require("../models/Contest")

const fetchUpcomingContests = async () => {
    try {
        const response = await fetch(process.env.UPCOMING_CONTESTS_API)
        const responseJSON = await response.json()
        
        for(const contest of responseJSON.data){
            const {contestCode} = contest
            await Contest.findOneAndUpdate({contestCode},contest,{upsert : true,new : true})
        }
        console.log("Upcoming contests fetched and updated successfully.");
        
    } catch (error) {
        console.error("Failed to fetch upcoming contests:", error);
        throw error;
    }
}

module.exports = fetchUpcomingContests;