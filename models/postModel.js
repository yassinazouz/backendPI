
const mongoose = require('mongoose');

// Define the schema for a post
const postSchema = new mongoose.Schema({
    object: { type: String, required: true },
    text: { type: String, required: true },
    media: { type: String },
    upvote: { type: Number },
    downvote: { type: Number },
    createdAt: { type: Date, default: Date.now }
});

// Create and export the model
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
