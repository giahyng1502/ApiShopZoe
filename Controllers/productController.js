const { Category, Product, Comment } = require("../Models/product");

const productController = {
  // Lấy tất cả sản phẩm
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (error) {
      console.log("Lấy danh sách sản phẩm thất bại", error);
      res.status(500).json({ message: "Lấy danh sách sản phẩm thất bại" });
    }
  },

  // Thêm sản phẩm
  addProduct: async (req, res) => {
    try {
      const newProduct = new Product(req.body);
      const savedProduct = await newProduct.save();
      if (savedProduct) {
        const categoryId = req.body.category; // Sửa thành req.body.category
        await Category.updateOne(
          { _id: categoryId },
          { $push: { products: savedProduct._id } }
        );
        console.log("Thêm sản phẩm vào danh mục thành công");
      }
      res.status(201).json(savedProduct);
    } catch (error) {
      res.status(500).json({ message: "Thêm sản phẩm thất bại" });
      console.log("Thêm sản phẩm thất bại", error);
    }
  },
  createComment: async (req, res) => {
    try {
      // 672756be0b513186e9c9ab87
      const productId = req.params.productId; // Lấy ID sản phẩm từ tham số URL
      const newComment = req.body; // Lấy dữ liệu người dùng và nội dung bình luận từ body
      console.log(productId);
      console.log(newComment);
      // Cập nhật sản phẩm và thêm bình luận vào mảng comments
      const updatedProduct = await Product.findByIdAndUpdate(
        { _id: productId },
        { $push: { comments: newComment } },
        { new: true }
      ); // Thêm bình luận vào mảng comments)
      if (updatedProduct) {
        console.log("Thêm bình luận thành công");
        return res.status(201).json(updatedProduct); // Trả về sản phẩm đã cập nhật với bình luận mới
      } else {
        console.log("Không tìm thấy sản phẩm");
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }
    } catch (error) {
      console.error("Thêm bình luận thất bại", error);
      return res.status(500).json({ message: "Thêm bình luận thất bại" });
    }
  },

  // Xóa bình luận
  deleteComment: async (req, res) => {
    try {
      const productId = req.params.productId; // Lấy ID sản phẩm từ tham số URL
      const commentId = req.params.commentId; // Lấy ID bình luận từ tham số URL
      console.log(productId);
      console.log(commentId);
      // Cập nhật sản phẩm và xóa bình luận
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { $pull: { comments: { _id: commentId } } }, // Loại bỏ bình luận có ID tương ứng
        { new: true } // Trả về sản phẩm đã được cập nhật
      );

      if (updatedProduct) {
        console.log("Xóa bình luận thành công");
        return res.status(200).json(updatedProduct); // Trả về sản phẩm đã cập nhật
      } else {
        console.log("Không tìm thấy sản phẩm");
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }
    } catch (error) {
      console.error("Xóa bình luận thất bại", error);
      return res.status(500).json({ message: "Xóa bình luận thất bại" });
    }
  },
};

module.exports = productController;
