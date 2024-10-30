const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userController = {
  register: async (req, res) => {
    const { name, phoneNumber, password } = req.body;
    try {
      let user = await User.findOne({ phoneNumber: phoneNumber });
      if (!user) {
        const hashPassword = await bcrypt.hash(password, 10);
        user = new User({
          name: name,
          phoneNumber: phoneNumber,
          password: hashPassword,
        });
        const saveUser = await user.save();
        return res.status(200).json(saveUser);
      }
      return res
        .status(409)
        .json({ msg: "Số điện thoại này đã tồn tại trên hệ thống" });
    } catch (e) {
      res.status(500).json({
        msg: "Đăng ký tài khoản thất bại",
        error: e.message,
      });
      console.log("Đăng ký tài khoản thất bại", e.message);
    }
  },
  login: async (req, res) => {
    const { phoneNumber, password } = req.body;
    try {
      const user = await User.findOne({ phoneNumber: phoneNumber });
      if (!user) {
        return res.status(404).json({ msg: "Tài khoản này không tồn tại" });
      }

      // Kiểm tra mật khẩu
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ msg: "Mật khẩu không đúng" });
      }

      // Tạo token JWT
      const token = jwt.sign(
        {
          userId: user._id,
          phoneNumber: user.phoneNumber,
          name: user.name,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      return res.status(200).json({ token: token });
    } catch (e) {
      res.status(500).json({
        msg: "Đăng nhập thất bại",
        error: e.message,
      });
      console.log("Đăng nhập thất bại", e.message);
    }
  },
  getAllUser: async (req, res) => {
    try {
      const users = await User.find({});
      return res.status(200).json(users);
    } catch (e) {
      res.status(500).json({
        msg: "Lấy thông tin của tất cả người dùng thất bại",
        error: e.message,
      });
      console.log("Lấy thông tin của tất cả người dùng thất bại", e.message);
    }
  },
};

module.exports = userController;
