const express = require("express");
const productController = require("../Controllers/productController");
const router = express.Router();

// Thêm sản phẩm
router.post("/add-product", productController.addProduct);

// Lấy tất cả sản phẩm
router.get("/getAll", productController.getAllProducts);

// Tạo bình luận cho sản phẩm
router.put("/create-comment/:productId", productController.createComment);

// Xóa bình luận của sản phẩm
router.delete(
  "/delete-comment/:productId/comments/:commentId",
  productController.deleteComment
);

module.exports = router;
