const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
        default: "",
    },
    name: {
        type: String,
        required: true,
        default: "",

    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: Boolean,
        required: true,
        default: false,
    },
    address: {
        type: String,
        default: "",
    },
    avatar: {
        type: String,
        default: "",

    }
})
const User = mongoose.model("User", userSchema);
module.exports = User;
