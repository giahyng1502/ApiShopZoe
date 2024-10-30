const mongoose = require("mongoose");
const dotenv = require("dotenv").config()
mongoose.connect(process.env.DATA_BASE)
    .then(() => console.log("Kết nối thành công đến database"))
    .catch((err) => {
        console.log("Kết nối thất bại : ", err)
    })