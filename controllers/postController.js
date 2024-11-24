const Post = require('../models/postModel');
const User = require('../models/userModel');
const connectToDatabase = require('../config/database');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path'); 

// Get all posts with full image content
async function getAllPosts(req, res) {
    try {
        const db = await connectToDatabase();
        const posts = await db.collection('posts').find({}).toArray();

        const postsWithImages = await Promise.all(posts.map(async (post) => {
            if (post.media && post.media.length > 0) {
                // Read each image file and convert to base64
                post.media = await Promise.all(post.media.map(async (mediaPath) => {
                    const filePath = path.join(__dirname, '..', mediaPath); // Get full path to image
                    try {
                        const fileData = fs.readFileSync(filePath); // Read file
                        const base64Image = fileData.toString('base64'); // Convert image to base64 string
                        return `data:image/png;base64,${base64Image}`; // Return base64 string with image type prefix
                    } catch (error) {
                        console.error(`Error reading file at ${filePath}:`, error);
                        return null;
                    }
                }));
            }
            return post;
        }));

        res.status(200).send(postsWithImages);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Error fetching posts" });
    }
}



async function getPosts(req, res) {
    try {
        const db = await connectToDatabase();
        const posts = await db.collection('posts').find({}).toArray();

        const postsWithUserDetails = await Promise.all(posts.map(async (post) => {
            const user = await db.collection('users').findOne({ _id: post.user }); 
            post.userDetails = user;
            return post;
        }));

        res.json(postsWithUserDetails);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ message: 'Error fetching posts' });
    }
}


const addPost = async (req, res) => {
    console.log(req.body);
    console.log(req.files);
    const { content } = req.body;
    if (!content || content.trim() === '') {
        return res.status(400).send({ error: "Content is required" });
    }

    const mediaPaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    try {
        const db = await connectToDatabase();
        const user = req.user.userId; // Assuming req.user contains the user's id

        await db.collection('posts').insertOne({
            content,
            media: mediaPaths,
            upvote: 0,
            downvote: 0,
            createdAt: new Date(),
            user
        });

        res.status(201).json({
            message: "Post created successfully",
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Error creating post" });
    }
};


async function upvotePost(req, res) {
    const { postId } = req.params;
    try {
        const db = await connectToDatabase(); // Connect to the database
        const updatedPost = await db.collection('posts').findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(postId) },
            { $inc: { upvote: 1 } },
            { returnOriginal: false } // Return the updated post
        );


        res.status(200).json({ message: "Upvoted successfully", post: updatedPost.value });
    } catch (err) {
        console.error('Error upvoting post:', err);
        res.status(500).json({ error: "Error upvoting post" });
    }
}

// Downvote a post
async function downvotePost(req, res) {
    const { postId } = req.params;
    try {
        const db = await connectToDatabase(); // Connect to the database
        const updatedPost = await db.collection('posts').findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(postId) },
            { $inc: { downvote: 1 } },
            { returnOriginal: false } // Return the updated post
        );


        res.status(200).json({ message: "Downvoted successfully", post: updatedPost.value });
    } catch (err) {
        console.error('Error downvoting post:', err);
        res.status(500).json({ error: "Error downvoting post" });
    }
}

module.exports = { getAllPosts,addPost,getPosts,upvotePost, downvotePost };
