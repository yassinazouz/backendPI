const express = require('express');
const { login, signup, getAllUsers, updateUser, getUserById } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../config/multerConfig');
const router = express.Router();

// Define routes
router.post('/login', login);
router.post('/signup', upload.single('image'), signup);
router.get('/', authMiddleware.RoleauthMiddleware, getAllUsers);
router.get('/:userId', getUserById);
router.put('/update/:userId', updateUser);

module.exports = router;