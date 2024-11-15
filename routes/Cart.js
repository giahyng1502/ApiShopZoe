const {userMiddleware} = require("../Middlewares/authMiddleware");
const cartController = require("../Controllers/cartController");
const route = require('express').Router();

route.post('/addToCart', userMiddleware,cartController.addToCart);
route.put('/updateCart/:productInCartId', userMiddleware, cartController.updateCart);
route.get('/getAll', userMiddleware, cartController.getAll);
module.exports = route;
