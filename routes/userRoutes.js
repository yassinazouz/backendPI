const express = require('express');
const { login, signup, getAllUsers, updateUser,getUserById } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Define routes
router.post('/login', login);
router.post('/signup', upload.single('image'), signup);
router.get('/', getAllUsers);
router.get('/:userId', getUserById);
router.put('/update/:userId', updateUser);

module.exports = router;
