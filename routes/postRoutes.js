const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');


router.get('/', postController.getAllPosts);
router.post('/add', postController.addPost);
router.get('/postusers', postController.getPosts);

router.post('/:postId/upvote', postController.upvotePost);
router.post('/:postId/downvote', postController.downvotePost);

module.exports = router;