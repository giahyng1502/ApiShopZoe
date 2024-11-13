const Cart = require('../Models/cart');
const {Product} = require('../Models/product');
const User = require('../Models/user');
const cartController = {
    addToCart: async (req, res) => {
        const { productId, quantity, size, color } = req.body;
        const userId = req.user.userId;
        try {
            // console.log(userId)
            console.log(req.body)
            if (!productId || !quantity || quantity <= 0) {
                return res.status(400).json({ message: "Dữ liệu đầu vào không hợp lệ" });
            }
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
            }
            let cart = await Cart.findOne({ User: userId });
            if (!cart) {
                cart = new Cart(
                    { User: userId ,
                items: [{ item: productId,
                    size, color, quantity }] });
            }
            else {
                const index = cart.items.findIndex(item => item.item.toString() === productId
                    && size === item.size
                    && color === item.color);
                if (index !== -1) {
                    cart.items[index].quantity += quantity;
                }else {
                    cart.items.push({ item: productId, size, color, quantity });
                }
            }
            cart.totalPrice = cart.items.reduce((total, item) => total + (item.quantity * product.price), 0);
            await cart.save();
            res.json(cart);

        }catch (e) {
            console.log("them vào giỏ hàng có lỗi xảy ra",e)
            res.status(500).json({ message: "Lỗi máy chủ" });
        }
    },
    getAll : async (req,res) => {
        const userId = req.user.userId;
        try {
            const cart = await Cart.findOne({ User: userId }).populate("items.item");
            if (!cart) {
                return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
            }
            res.status(200).json(cart);
        } catch (e) {
            console.log("lấy giỏ hàng có Lỗi xảy ra",e)
            res.status(500).json({ message: "Lỗi máy chủ" });
        }
    }
}
module.exports = cartController;
