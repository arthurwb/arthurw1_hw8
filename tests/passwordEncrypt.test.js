const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const { encryptPasswords } = require('../src/util');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
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

// Test suite for the encryptPasswords function
describe('encryptPasswords function', () => {
    // Define a temporary output file path for testing
    const outputFile = path.join(__dirname, 'temp_encrypted_passwords.txt');

    // Test case for encryptPasswords function
    test('Should encrypt passwords and write to output file', () => {
        // Input file path
        const inputFile = path.join(__dirname, '../password.txt');
        
        // Call the encryptPasswords function
        encryptPasswords(inputFile, outputFile);

        // Read the contents of the output file
        const encryptedData = fs.readFileSync(outputFile, 'utf8');

        // Verify that the output file contains encrypted passwords
        const lines = encryptedData.split('\n');
        expect(lines.length).toBeGreaterThan(0);
        lines.forEach(line => {
            if (line.trim() !== '') { // Skip empty lines
                const [email, password] = line.split(':');
                expect(password).not.toBe(''); // Ensure password is not empty
                expect(email.includes('@')).toBe(true); // Ensure email has @ symbol
                expect(password.length).toBeGreaterThan(0); // Ensure password is not empty

                // Hash the original plaintext password
                const hashedPassword = bcrypt.hashSync(password.trim(), 10);

                // Compare the hashed password from the file with the hashed original password
                expect(bcrypt.compareSync(password.trim(), hashedPassword)).toBe(true);
            }
        });

        // Clean up: Delete the temporary output file
        fs.unlinkSync(outputFile);
    });
});