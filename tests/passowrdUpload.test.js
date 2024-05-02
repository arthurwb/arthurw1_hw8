const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const { uploadToMongoDB } = require('../src/util');
const path = require('path');
const User = require('../src/model');
require('dotenv').config(); 

let client;

beforeAll(async () => {
    client = await MongoClient.connect(process.env.URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    const db = client.db();

    console.log("Connected to MongoDB: " + db);

    await mongoose.connect(process.env.URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

afterAll(async () => {
    await mongoose.disconnect();
    await client.close();
});

describe('uploadToMongoDB function', () => {
    // Test case for uploadToMongoDB function
    test('Should upload user data to MongoDB', async () => {
        // Input file path
        const inputFile = path.join(__dirname, '../password.txt');

        // Call the uploadToMongoDB function
        await uploadToMongoDB(inputFile);

        // Retrieve the user data from MongoDB and verify
        const users = await User.find({});
        expect(users.length).toBeGreaterThan(0);

        // Clean up: Delete the user data from MongoDB
        await User.deleteMany({});
    });
});