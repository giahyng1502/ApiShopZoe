const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    phoneNumber : {
        type: String,
        required: true,
    },
    name : {
        type: String,
        required: true,
    },
    password : {
        type: String,
        required: true,
    },
    role : {
        type : Boolean,
        required: true,
        default: false,
    },
    address : {
        type: String,
    },
    avatar : {
        type: String,
    }
})
const User = mongoose.model("User", userSchema);
module.exports = User;
