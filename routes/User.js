var express = require("express");
var router = express.Router();
const userController = require("../Controllers/userController");
const middleware = require("../Middlewares/authMiddleware");
const {userMiddleware} = require("../Middlewares/authMiddleware");

/* GET users listing. */
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/getAll", middleware.verifyAdmin, userController.getAllUser);
router.get("/getUser", userMiddleware, userController.getUser);
router.put("/updateUser", userMiddleware, userController.updateUser);
module.exports = router;
