const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const { checkCredentials, encryptPasswords, uploadToMongoDB } = require('../src/util');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
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

describe('checkCredentials function', () => {
    test('Should return false for sm.cho@hello.com with password 123', async () => {
        const result = await checkCredentials('sm.cho@hello.com', '123');
        expect(result).toBe(false);
    }, 10000);

    test('Should return false for noname@hello.come with password 1234', async () => {
        const result = await checkCredentials('noname@hello.come', '1234');
        expect(result).toBe(false);
    }, 10000);

    test('Should return false for alan.may@best.com without password', async () => {
        const result = await checkCredentials('alan.may@best.com', '');
        expect(result).toBe(false);
    }, 10000);
});

// Test suite for the uploadToMongoDB function
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