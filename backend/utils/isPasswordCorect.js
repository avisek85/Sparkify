const bcrypt = require('bcrypt')

async function isPasswordCorrect (password,hashedPassword){
    return await bcrypt.compare(password, hashedPassword);
}

module.exports = isPasswordCorrect;