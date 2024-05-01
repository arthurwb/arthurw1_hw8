const fs = require('fs');
const bcrypt = require('bcrypt');
const User = require('./model');

function encryptPasswords(inputFile, outputFile) {
    const data = fs.readFileSync(inputFile, 'utf8').split('\n');
    const encryptedData = data.map(line => {
        const [email, password] = line.split(':');
        const hashedPassword = bcrypt.hashSync(password.trim(), 10);
        return `${email}:${hashedPassword}`;
    });
    fs.writeFileSync(outputFile, encryptedData.join('\n'));
}

function uploadToMongoDB(inputFile) {
    const data = fs.readFileSync(inputFile, 'utf8').split('\n');
    data.forEach(line => {
        const [email, password] = line.split(':');
        const newUser = new User({
            email: email.trim(),
            password: password.trim()
        });
        newUser.save();
    });
}

async function checkCredentials(email, password) {
    const user = await User.findOne({ email });
    if (!user) return false;
    return await bcrypt.compare(password, user.password);
}

module.exports = {
    encryptPasswords,
    uploadToMongoDB,
    checkCredentials
};