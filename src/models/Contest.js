const mongoose = require("mongoose")


const contestSchema = new mongoose.Schema({
    contestCode : {
        type : String
    },
    contestDuration : {
        type : Number
    },

    contestEndDate : {
        type : Date,
    },
    contestName : {
        type : String,
        required : true
    },

    contestRegistrationEndDate :{
        type : Date ,
        required : true,
    },
    
    contestRegistrationStartDate:{
        type : Date ,
        required : true,
    },
   
    contestSlug : {
        type : String
    },

    contestStartDate :{
        type : Date ,
        required : true,
    },
    contestType : {
        type : String
    },

    contestUrl : {
        type : String,
        validate(value)  {
            if(!validator.isURL(value)) throw new Error("Invalid Contest URL")
        }
    },
    platform : {
        type : String,
        required : true
    }
})

const Contest = mongoose.model("Contest",contestSchema)

module.exports = Contest