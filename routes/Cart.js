const {userMiddleware} = require("../Middlewares/authMiddleware");
const cartController = require("../Controllers/cartController");
const route = require('express').Router();

route.post('/addToCart', userMiddleware,cartController.addToCart);
route.get('/getAll', userMiddleware, cartController.getAll);
module.exports = route;
