const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema({
    items : [{
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
        quantity: Number,
        size: String,
        color: String
    }],
    User:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    }
})

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
