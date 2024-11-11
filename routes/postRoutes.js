const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');


router.get('/', postController.getAllPosts);
router.post('/add', postController.addPost);
router.get('/postusers', postController.getPosts);

module.exports = router;