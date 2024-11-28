const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const upload = require('../config/multerConfig');
const authMiddleware = require('../middlewares/authMiddleware');



router.get('/', postController.getAllPosts);
router.post('/add', upload.array('media', 10),authMiddleware.authMiddleware,postController.addPost);
router.post('/:postId/upvote', postController.upvotePost);
router.post('/:postId/downvote', postController.downvotePost);

module.exports = router;