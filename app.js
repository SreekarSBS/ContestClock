require("dotenv").config()
const express = require("express")
const cors = require("cors")
const ConnectDB = require("./src/config/database")
const contestRouter = require("./src/routes/contests")
const userRouter = require("./src/routes/user")
const agenda = require("./src/utils/agenda")
const defineSendReminderJob = require("./src/utils/sendMail")


const app = express()

defineSendReminderJob(agenda);

// Wrap in IIFE (Immediately Invoked Function Expression)
(async () => {
  try {
    await agenda.start();
    console.log("Agenda started");
  } catch (err) {
    console.error("Failed to start Agenda:", err);
  }
})();
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}))

require("./src/utils/cronjob")

app.use("/",contestRouter)
app.use("/",userRouter)

ConnectDB().then(() => {
    console.log("Connection Estabilished");
    app.listen(3000,() => {
        console.log("Server running on port 3000");
    })
}).catch((err) => console.log("Database Connection Failed")
)
