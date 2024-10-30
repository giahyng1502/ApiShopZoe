const jwt = require('jsonwebtoken');


    const userMiddleware = async (req, res, next) => {
        const token = req.header("Authorization");
        console.log(token);
        if (!token) {
            return res.status(401).json({msg: "Vui lòng đăng nhập để thực hiện chức năng"})
        }
        jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({msg: "Phiên đăng nhập của bạn đã kết thúc"})
            }
            req.user = decoded;
            next()
        })
    };
    const verifyAdmin = async (req, res, next) => {
        await userMiddleware(req, res, () => {
            if (req.user.role) {
                next()
            } else {
                return res.status(403).json({msg: "Bạn không có quyền truy cập"});
            }
        });
    }

module.exports = {userMiddleware, verifyAdmin};