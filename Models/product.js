const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Tham chiếu đến model User
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
});
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: [String],
    required: true, // Cần có ít nhất một ảnh
  },
  description: {
    type: [String],
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  comments: {
    type: [commentSchema],
    default: [],
  }, // Mảng bình luận
  rating: {
    type: Number,
    min: 0, // Điểm thấp nhất
    max: 5, // Điểm cao nhất
    default: 0, // Giá trị mặc định nếu không có đánh giá
  },
  soldQuantity: {
    type: Number,
    default: 0, // Giá trị mặc định
  },
  status: {
    type: Boolean,
    default: true, // Trạng thái mặc định là đang bán
  },
});

const Product = mongoose.model("Product", productSchema);
const Category = mongoose.model("Category", categorySchema);
module.exports = { Product, Category };
