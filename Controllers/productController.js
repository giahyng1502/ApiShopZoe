const { Category, Product } = require("../Models/product");

const productController = {
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find();
      res.status.json(products);
    } catch (error) {
      console.log("Lấy danh sách sản phẩm thất bại", error);
      res.status(500).json({ message: "Lấy danh sách sản phẩm thất bại" });
    }
  },
  addProduct: async (req, res) => {
    try {
      const newProduct = new Product(req.body);
      const savedProduct = await newProduct.save();
      if (savedProduct) {
        const categoryId = req.body.categoryId;
        const category = await Category.updateOne(
          { _id: categoryId },
          { $push: { products: savedProduct._id } }
        );
        if (category) {
          console.log("Thêm sản phẩm vào danh mục thành công");
        } else {
          console.log("Thêm sản phẩm vào danh mục thất bại");
        }
      }
      res.status(201).json(savedProduct);
    } catch (error) {
      res.status(500).json({ message: "Thêm sản phẩm thất bại" });
      console.log("Thêm sản phẩm thất bại", error);
    }
  },
};
module.exports = productController;
