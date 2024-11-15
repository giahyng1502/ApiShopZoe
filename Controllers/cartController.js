const Cart = require('../Models/cart');
const {Product} = require('../Models/product');
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
            const total = cart.items.reduce((total, item) => total + (item.quantity * item.item.price), 0);
            if (cart.totalPrice !== total) {
                cart.totalPrice = total;
                cart.save();
            }
            res.status(200).json(cart);
        } catch (e) {
            console.log("lấy giỏ hàng có Lỗi xảy ra",e)
            res.status(500).json({ message: "Lỗi máy chủ" });
        }
    },
    updateCart: async (req, res) => {
        const userId = req.user.userId;
        const {size, color, quantity } = req.body;
        const productInCartId = req.params.productInCartId;
        // console.log(req.body)
        try {
            let cart = await Cart.findOne({ User: userId });
            if (!cart) {
                return res.status(405).json({ message: "Không tìm thấy giỏ hàng" });
            }
            const productInCart = cart.items.findIndex(item => item._id.toString() === productInCartId);
            if (productInCart === -1) {
                return res.status(403).json({ message: "Không tìm thấy sản phẩm trong giỏ hàng" });
            }

            if (quantity === 0) {
                cart.items.splice(productInCart, 1);
                await cart.save();
                return res.status(200).json(cart);
            }

            const index = cart.items.findIndex(item => item.item._id.toString() === productId
                && size === item.size
                && color === item.color
                && item._id.toString() !== productInCartId
            );
            if (index !== -1) {
                cart.items[index].quantity += quantity
                if (cart.items[index].quantity > 20) {
                    cart.items[index].quantity = 20;
                }
                cart.items.splice(productInCart, 1);
                cart.save()
                return res.status(200).json(cart);
            }
            cart.items[productInCart].size = size;
            cart.items[productInCart].color = color;
            cart.items[productInCart].quantity = quantity;

            await cart.save();
            res.status(200).json(cart);

        }catch (e) {
            console.log("lấy giỏ hàng có Lỗi xảy ra",e)
            res.status(500).json({ message: "Lỗi máy chủ" });
        }
    },
}
module.exports = cartController;
