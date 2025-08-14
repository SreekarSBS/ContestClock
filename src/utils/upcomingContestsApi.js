const Contest = require("../models/Contest")

const fetchUpcomingContests = async () => {
    try {
        const response = await fetch(process.env.UPCOMING_CONTESTS_API)
        const responseJSON = await response.json()
        
        for(const contest of responseJSON.data){
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
        console.log("Upcoming contests fetched and updated successfully.");
        
    } catch (error) {
        console.error("Failed to fetch upcoming contests:", error);
        throw error;
    }
}

module.exports = fetchUpcomingContests;