
const cron = require("node-cron");
const contestsFromApi = require("./contestsFromApi");
const fetchUpcomingContests = require("./upcomingContestsApi");

cron.schedule("0 10,15 * * *",async() => {
    try {
        console.log("Calling the contests API");
     
     
     await contestsFromApi()
     await fetchUpcomingContests()   
    }   
    catch(err){
        console.log(err);
    }
})

