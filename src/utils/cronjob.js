
const cron = require("node-cron");
const contestsFromApi = require("./contestsFromApi");

cron.schedule("* 10,15 * * *",async() => {
    try {
        console.log("Calling the contests API");
        
     await contestsFromApi()
    }   
    catch(err){
        console.log(err);
    }
})

