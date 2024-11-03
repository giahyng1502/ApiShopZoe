const { Category } = require("../Models/product");

const categoryController = {
  addCategory: async (req, res) => {
    try {
      const name = req.body.name;
      console.log(name);
      const newCategory = new Category({ name });
      await newCategory.save();
      res.json(newCategory);
    } catch (error) {
      res.status(500).json({ error: "Lỗi server", error });
      console.log("Thêm danh mục thất bại:", error);
    }
  },
  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Lỗi server" });
      console.log("Lấy tất cả danh mục thất bại:", error);
    }
  },
  getCategoryById: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ error: "Danh mục không tồn tại" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: "Lỗi server" });
      console.log("Lấy danh mục theo ID thất bại:", error);
    }
  },
};
module.exports = categoryController;
