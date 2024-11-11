const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');
const User = require('./models/userModel');
const Post = require('./models/postModel');

const DB_URI = 'mongodb://localhost:27017/tipsandtrips';

const NUM_USERS = 10;
const NUM_POSTS = 50;

mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => {
        console.error('Connection error:', error);
        process.exit(1);
    });

const createFakeUsers = async () => {
    const users = [];

    for (let i = 0; i < NUM_USERS; i++) {
        const hashedPassword = await bcrypt.hash('password123', 10);

        const user = new User({
            name: faker.name.fullName(),
            email: faker.internet.email(),
            password: hashedPassword,
            telnum: faker.phone.number('###-###-####'),
            imageProfile: faker.image.avatar(),
        });

        users.push(user);
    }   
    return User.insertMany(users);
    
};


const createFakePosts = async (users) => {
    const posts = [];

    for (let i = 0; i < NUM_POSTS; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];

        const post = new Post({
            object: faker.lorem.words(3),
            text: faker.lorem.paragraph(),
            media: "", 
            upvote: 50,
            downvote: 10,
            createdAt: faker.date.past(),
            user:users[0],
        });

        posts.push(post);
    }

    return Post.insertMany(posts);
};

const seedDatabase = async () => {
    try {
        await User.deleteMany({});
        await Post.deleteMany({});
        console.log('Cleared existing data');

        const createdUsers = await createFakeUsers();
        console.log(`Created ${createdUsers.length} users`);

        const createdPosts = await createFakePosts(createdUsers);
        console.log(`Created ${createdPosts.length} posts`);

        console.log('Seeding completed successfully');
    } catch (error) {
        console.error('Seeding error:', error);
    } finally {
        mongoose.connection.close();
    }
};

seedDatabase();
