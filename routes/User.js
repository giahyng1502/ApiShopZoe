var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const middleware = require('../middlewares/authMiddleware');

/* GET users listing. */
router.post('/register',userController.register);
router.post('/login',userController.login);
router.get('/getAll',middleware.verifyAdmin,userController.getAllUser);

module.exports = router;
