const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    sound : {
        type : Boolean,
        default : true
    },
    email : {
        type : String,
        required : true
    },
    conversation : [
        {
            fromUser : {
                type : String,
                required : true
            },
            toUser : {
                type : String,
                required : true
            }
        }
    ],
    fileNumber : {
        type : Number,
        default : 0
    },
    picture : {
        type : String,
        required  : true
    }
})

const User = new mongoose.model("User",userSchema);

module.exports = User;