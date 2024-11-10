const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Route to get all posts
router.get('/', postController.getAllPosts);
router.post('/add', postController.addPost);

module.exports = router;