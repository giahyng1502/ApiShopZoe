const multer = require('multer');
const fs = require('fs');
const path = require('path');
const User = require("../Models/user");
const router = require('express').Router();

// Tạo thư mục nếu chưa tồn tại
if (!fs.existsSync('./public/uploads')) {
    fs.mkdirSync('./public/uploads', {recursive: true});
}

// Cấu hình multer
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Chỉ chấp nhận file hình ảnh'));
        }
        cb(null, true);
    }
});

// API upload file
router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({error: 'Không tìm thấy file tải lên'});
        }
        const filePath = `http://10.0.2.2:3000/uploads/${req.file.filename}`;
        res.status(200).json({error: null, url: filePath});
    } catch (ex) {
        console.error('Lỗi khi upload:', ex.message);
        res.status(500).json({error: ex.message});
    }
});
router.get('/',async (req, res) => {
    const user = await User.find({})
    res.json(user)
})
module.exports = router;
