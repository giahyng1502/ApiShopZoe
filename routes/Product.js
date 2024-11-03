const express = require("express");
const productController = require("../Controllers/productController");
const router = express.Router();

router.post("/add-product", productController.addProduct);
router.get("/getAll", productController.getAllProducts);

module.exports = router;
