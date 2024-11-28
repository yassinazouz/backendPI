const Post = require('../models/postModel');
const User = require('../models/userModel');
const connectToDatabase = require('../config/database');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path'); 
const { ObjectId } = require('mongodb');
const { uploadFileToDrive } = require('../config/path_to_drive_helper');




async function getAllPosts(req, res) {
    try {
        const db = await connectToDatabase();
        const posts = await db.collection('posts').find({}).toArray();
        const postsWithUserInfo = await Promise.all(posts.map(async (post) => {
            if (post.user) {
                const user = await db.collection('users').findOne({ _id: new ObjectId(post.user) });
                if (user) {
                    console.log(user)
                    post.userName = user.name;
                    post.imageProfile = user.image || '';
                }
            }
            return post;
        }));

        // Send back the modified posts
        res.status(200).send(postsWithUserInfo);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Error fetching posts" });
    }
}


/**************************************************************************************************************************************/

const addPost = async (req, res) => {
    const { content, title } = req.body;
    if (!content || content.trim() === '') {
        return res.status(400).send({ error: "Content is required" });
    }
    try {
        const db = await connectToDatabase();
        const user = req.user.userId;

        let mediaLinks = [];
        if (req.files) {
            for (const file of req.files) {
                const filePath = path.join(__dirname, '..', 'uploads', file.filename); 
                const fileLink = await uploadFileToDrive(filePath, file.filename);
                mediaLinks.push(fileLink);
                fs.unlinkSync(filePath);
            }
        }

        await db.collection('posts').insertOne({
            title,
            content,
            media: mediaLinks,
            upvote: 0,
            downvote: 0,
            createdAt: new Date(),
            user,
        });

        res.status(201).json({
            message: "Post created successfully",
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Error creating post" });
    }
};

/**************************************************************************************************************************************/


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

module.exports = { getAllPosts,addPost,upvotePost, downvotePost };
