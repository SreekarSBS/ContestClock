const mongoose = require("mongoose")
const validator = require("validator")

const userSchema = mongoose.Schema({
    uid : {
        type : String,
        required : true,
        unique : true,
        index : true
    }
    ,
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        validate(value) {
            if(!validator.isEmail(value)) throw new Error("Invalid Email")
        }
    },
    picture : {
        type : String,
        
    },
    savedContests: [
        {
        type : [mongoose.Schema.Types.ObjectId],
        ref : "Contest"
        }
]
},{timestamps : true})

const User = mongoose.model("User",userSchema)
module.exports = User