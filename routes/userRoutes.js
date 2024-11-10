const express = require('express');
const { login, signup, getAllUsers, updateUser } = require('../controllers/userController');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Define routes
router.post('/login', login);
router.post('/signup', upload.single('image'), signup);
router.get('/', getAllUsers);
router.put('/update/:userId', updateUser);

module.exports = router;
