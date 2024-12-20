const bcrypt = require('bcrypt');
const connectToDatabase = require('../config/database');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { uploadFileToDrive } = require('../config/path_to_drive_helper');
const path = require('path');
const fs = require('fs');
async function getAllUsers(req, res) {
    try {
        const db = await connectToDatabase();
        const users = await db.collection('users').find({}).toArray();
        res.send(users);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Error fetching users from the database" });
    }
}

async function login(req, res) {
    const { email, pass } = req.body;

    try {
        const db = await connectToDatabase();
        const user = await db.collection('users').findOne({ email });
        if (user && await bcrypt.compare(pass, user.password)) {
            const token = jwt.sign({ userId: user._id, Role: user.role}, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.send({ user, token });
        } else {
            res.status(401).send({ error: "Invalid email or password" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Error logging in" });
    }
}

/***********************************************************************************************************************************/


async function signup(req, res) {
    console.log(req.body)
    const { name, email, pass, telnum } = req.body;
    
    let imageProfile = ''; 
    try {
        if (req.file) {
            const filePath = path.join(__dirname, '..', 'uploads',req.file.filename);
            
            imageProfile = await uploadFileToDrive(filePath, req.file.filename);
            fs.unlinkSync(filePath);
        }

        const db = await connectToDatabase();
        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
            return res.send({ result: "already registered" });
        }

        const hashedPassword = await bcrypt.hash(pass, 10);

        await db.collection('users').insertOne({
            name,
            email,
            password: hashedPassword,
            telnum,
            image: imageProfile,
            role: "user"
        });

        res.send({ result: "registered successfully", imageProfile });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Error registering user" });
    }
};


async function updateUser(req, res) {
    const { userId } = req.params; // Assuming you're passing the user's ID in the URL parameter
    const { name, email, pass, telnum } = req.body;

    try {
        const db = await connectToDatabase();
        
        const updateData = {};
        
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (telnum) updateData.telnum = telnum;

        if (pass) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(pass, saltRounds);
            updateData.password = hashedPassword;
        }

        if (req.file) {
            const imageProfile = `/uploads/${req.file.filename}`;
            updateData.imageProfile = imageProfile;
        }

        const result = await db.collection('users').updateOne(
            { _id: new ObjectId(userId) },  // Use ObjectId correctly here
            { $set: updateData }
        );

        if (result.matchedCount > 0) {
            res.send({ result: "User updated successfully" });
        } else {
            res.status(404).send({ error: "User not found" });
        }

    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Error updating user" });
    }
}

async function getUserById(req, res) {
    const { userId } = req.params;
    try {
        const db = await connectToDatabase();
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }
        const posts = await db.collection('posts').find({ user: new ObjectId(userId) }).toArray();
        res.send({
            user,
            posts
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Error fetching user by ID and their posts" });
    }
}

module.exports = { login, signup, getAllUsers, updateUser,getUserById};