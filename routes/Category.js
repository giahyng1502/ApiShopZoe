const express = require("express");
const categoryController = require("../Controllers/categoryController");
const router = express.Router();

router.post("/add-category", categoryController.addCategory);
router.get("/getAll", categoryController.getAllCategories);
router.get("/getById/:id", categoryController.getCategoryById);

module.exports = router;
