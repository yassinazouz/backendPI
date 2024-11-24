
const mongoose = require('mongoose');

// Define the schema for a post
const postSchema = new mongoose.Schema({
    content: { type: String, required: true },
    media: { type: [String], default: [] },
    upvote: { type: Number, default: 0 },
    downvote: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});


// Create and export the model
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
