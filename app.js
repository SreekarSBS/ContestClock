const express = require("express")
const ConnectDB = require("./src/config/database")
const contestRouter = require("./src/routes/contests")
const userRouter = require("./src/routes/user")
const app = express()
require("dotenv").config()
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
