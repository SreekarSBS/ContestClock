require("dotenv").config()
const express = require("express")
const cors = require("cors")
const ConnectDB = require("./config/database")
const contestRouter = require("./routes/contests")
const userRouter = require("./routes/user")
const agenda = require("./utils/agenda")
const defineSendReminderJob = require("./utils/sendMail")


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
const origins = ["https://contest-clock-ui.vercel.app", "http://localhost:3000"]
app.use(cors({
    origin : origins,
    credentials : true
}))

require("./utils/cronjob")

app.use("/",contestRouter)
app.use("/",userRouter)

ConnectDB().then(() => {
    console.log("Connection Estabilished");
    app.listen(3000,() => {
        console.log("Server running on port 3000");
    })
}).catch((err) => console.log("Database Connection Failed")
)
