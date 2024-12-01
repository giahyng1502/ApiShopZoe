const Cart = require('../Models/cart');
const {Product} = require('../Models/product');
const cartController = {
    addToCart: async (req, res) => {
        const {productId, quantity, size, color} = req.body;
        const userId = req.user.userId;
        try {
            // Kiểm tra đầu vào
            if (!productId || !quantity || quantity <= 0) {
                return res.status(400).json({message: "Dữ liệu đầu vào không hợp lệ"});
            }

            // Tìm sản phẩm trong cơ sở dữ liệu
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({message: "Không tìm thấy sản phẩm"});
            }

            // Tìm hoặc tạo giỏ hàng của người dùng
            let cart = await Cart.findOne({User: userId});
            if (!cart) {
                cart = new Cart({
                    User: userId,
                    items: [{
                        item: productId,
                        size,
                        color,
                        quantity
                    }]
                });
            } else {
                // Tìm sản phẩm trong giỏ hàng
                const index = cart.items.findIndex(item =>
                    item.item.toString() === productId &&
                    size === item.size &&
                    color === item.color
                );

                if (index !== -1) {
                    // Nếu sản phẩm đã tồn tại, tăng số lượng
                    cart.items[index].quantity += quantity;
                } else {
                    // Nếu sản phẩm chưa tồn tại, thêm mới
                    cart.items.push({item: productId, size, color, quantity});
                }
            }

            // Cập nhật tổng giá
            cart.totalPrice = cart.items.reduce((total, item) => {
                return total + (item.quantity * product.price);
            }, 0);

            // Lưu giỏ hàng và thực hiện populate
            await cart.save();
            const populatedCart = await Cart.findOne({User: userId}).populate("items.item");

            // Trả về giỏ hàng đã populate
            res.status(200).json(populatedCart);
        } catch (e) {
            console.error("Thêm vào giỏ hàng có lỗi xảy ra", e);
            res.status(500).json({message: "Lỗi máy chủ"});
        }
    },
    getAll: async (req, res) => {
        const userId = req.user.userId;
        try {
            const cart = await Cart.findOne({User: userId}).populate("items.item");
            if (!cart) {
                return res.status(404).json({message: "Không tìm thấy giỏ hàng"});
            }
            res.status(200).json(cart);
        } catch (e) {
            console.log("lấy giỏ hàng có Lỗi xảy ra", e)
            res.status(500).json({message: "Lỗi máy chủ"});
        }
    },
    updateCart: async (req, res) => {
        const userId = req.user.userId;
        const {size, color, quantity, productId} = req.body;
        const productInCartId = req.params.productInCartId;

        try {
            // Tìm giỏ hàng của người dùng
            let cart = await Cart.findOne({User: userId});
            if (!cart) {
                return res.status(405).json({message: "Không tìm thấy giỏ hàng"});
            }

            // Tìm sản phẩm trong giỏ hàng
            const productInCartIndex = cart.items.findIndex(
                item => item._id.toString() === productInCartId
            );
            if (productInCartIndex === -1) {
                return res.status(403).json({message: "Không tìm thấy sản phẩm trong giỏ hàng"});
            }

            // Kiểm tra sản phẩm có tồn tại trong hệ thống không
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({message: "Không tìm thấy sản phẩm"});
            }

            if (quantity === 0) {
                // Xóa sản phẩm khỏi giỏ hàng
                cart.items.splice(productInCartIndex, 1);
            } else {
                // Kiểm tra xem sản phẩm với cùng size và color đã tồn tại trong giỏ hàng chưa
                const duplicateIndex = cart.items.findIndex(
                    item =>
                        item.item.toString() === productId &&
                        size === item.size &&
                        color === item.color &&
                        item._id.toString() !== productInCartId
                );

                if (duplicateIndex !== -1) {
                    // Cộng dồn số lượng vào sản phẩm đã tồn tại
                    cart.items[duplicateIndex].quantity += quantity;
                    if (cart.items[duplicateIndex].quantity > 20) {
                        cart.items[duplicateIndex].quantity = 20; // Giới hạn số lượng tối đa
                    }
                    // Xóa sản phẩm cũ
                    cart.items.splice(productInCartIndex, 1);
                } else {
                    // Cập nhật sản phẩm hiện tại
                    cart.items[productInCartIndex].size = size;
                    cart.items[productInCartIndex].color = color;
                    cart.items[productInCartIndex].quantity = quantity;
                }
            }

            cart.totalPrice = cart.items.reduce((total, item) => {
                return total + (item.quantity * product.price);
            }, 0);
            // Lưu giỏ hàng và thực hiện populate
            await cart.save();
            const populatedCart = await Cart.findOne({User: userId}).populate("items.item");

            // Trả về giỏ hàng đã populate
            res.status(200).json(populatedCart);
        } catch (e) {
            console.error("Lỗi khi cập nhật giỏ hàng", e);
            res.status(500).json({message: "Lỗi máy chủ"});
        }
    },
}
module.exports = cartController;
