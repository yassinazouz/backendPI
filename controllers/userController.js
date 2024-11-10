const bcrypt = require('bcrypt');
const connectToDatabase = require('../config/database');
const { ObjectId } = require('mongodb');  // Correct import for ObjectId
const upload = require('../config/multerConfig'); // Import the custom multer configuration

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
            res.send({ result: user });
        } else {
            res.send({ result: "not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Error finding user" });
    }
}

async function signup(req, res) {
    // Handle the image upload using multer middleware
    upload.single('image')(req, res, async (err) => {
        if (err) {
            return res.status(400).send({ error: err.message });
        }

        const { name, email, pass, telnum } = req.body;

        if (!pass || pass.trim() === '') {
            return res.status(400).send({ error: "Password is required" });
        }

        const imageProfile = req.file ? `/uploads/${req.file.filename}` : '';

        try {
            const db = await connectToDatabase();
            const existingUser = await db.collection('users').findOne({ email });
            if (existingUser) {
                return res.send({ result: "already registered" });
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(pass, saltRounds);

            await db.collection('users').insertOne({
                name,
                email,
                password: hashedPassword,
                telnum,
                imageProfile
            });

            res.send({ result: "registered successfully", imageProfile });
        } catch (err) {
            console.error(err);
            res.status(500).send({ error: "Error registering user" });
        }
    });
}

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

module.exports = { login, signup, getAllUsers, updateUser };
