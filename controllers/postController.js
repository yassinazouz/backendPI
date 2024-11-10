const connectToDatabase = require('../config/database');
const Post = require('../models/postModel'); 

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
async function addPost(req, res) {
    console.log(req.body);  // Check the request body

    const { object, text, media, upvote, downvote } = req.body;

    try {
        const db = await connectToDatabase();
        const collection = db.collection('posts');

        // Insert the post into the 'posts' collection
        const result = await collection.insertOne({
            object,
            text,
            media,
            upvote,
            downvote,
            createdAt: new Date()  // Add createdAt field
        });

        // Get the inserted post using the insertedId
        const insertedPost = await collection.findOne({ _id: result.insertedId });

        // Send the response
        res.status(201).send({
            result: "Post created successfully",
            post: insertedPost,  // Return the inserted post
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Error creating post" });
    }
}

module.exports = { getAllPosts, addPost };



