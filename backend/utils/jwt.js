const jwt = require('jsonwebtoken');

const generateToken = (userId)=>{
    // console.log("id in jwt.js  " ,userId);
   return jwt.sign({id:userId},process.env.JWT_SECRET,{expiresIn:'100h'})


};

module.exports = generateToken;