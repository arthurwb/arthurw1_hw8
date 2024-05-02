const mongoose = require('mongoose');
require('dotenv').config(); 

const { encryptPasswords, uploadToMongoDB, checkCredentials } = require('./util');

mongoose.connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
console.log("Connected to database: " + db);

encryptPasswords('./password.txt', process.argv[2]);
uploadToMongoDB(process.argv[2]);

const email = process.argv[3];
const password = process.argv[4];

if (!email || !password) {
    console.log("Please provide both email and password.");
    process.exit(1);
}

console.log("Checking credentials...");
checkCredentials(email, password)
    .then(result => {
        console.log(`${email}:${password} =>`, result);
        process.exit(0);
    });