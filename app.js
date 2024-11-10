const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', userRoutes);  // Mount the user routes on /api/users
app.use('/api/posts', postRoutes);
app.use('/uploads', express.static('uploads'));


module.exports = app;
