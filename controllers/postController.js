const Post = require('../models/postModel');
const User = require('../models/userModel'); 
const connectToDatabase = require('../config/database');
// Get all posts with user details populated
async function getAllPosts(req, res) {
    try {
        const db = await connectToDatabase();
        const posts = await db.collection('posts').find({}).toArray();
        res.status(200).send(posts);
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


// Add a new post
async function addPost(req, res) {
    console.log(req.body);

    const { object, text, media, upvote, downvote, user } = req.body;
    try {
        const newPost = new Post({
            object,
            text,
            media,
            upvote: upvote || 0,
            downvote: downvote || 0,
            user,
            createdAt: new Date()
        });
        const savedPost = await newPost.save();
        res.status(201).send({
            result: "Post created successfully",
            post: savedPost
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Error creating post" });
    }
}

module.exports = { getAllPosts,addPost,getPosts };
