const mongoose = require('mongoose');
require('dotenv').config(); 

const { encryptPasswords, uploadToMongoDB, checkCredentials } = require('./util');

mongoose.connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

encryptPasswords('./password.txt', './password.enc.txt');
uploadToMongoDB('./password.enc.txt');

console.log("Checking credentials...");
checkCredentials('henry.taylor@edu.com', 'educatorbest')
    .then(result => console.log("henry.taylor@edu.com:educatorbest =>", result)); // Should return true

checkCredentials('sm.cho@hello.com', '123')
    .then(result => console.log("sm.cho@hello.com:123 =>", result)); // Should return false

checkCredentials('noname@hello.come', '1234')
    .then(result => console.log("noname@hello.come:1234 =>", result)); // Should return false

checkCredentials('alan.may@best.com', '')
    .then(result => console.log("alan.may@best.com: =>", result)); // Should return false