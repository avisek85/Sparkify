const jwt = require('jsonwebtoken');

const auth = (req,res,next)=>{
    try {
        const token = req.header('Authorization')?.split(' ')[1];
        if(!token){
            return res.status(403).json({message:"Access Denied"});
        }
        const verified = jwt.verify(token,process.env.JWT_SECRET);
        // console.log("verified in auth.middleware: ",verified);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({message:"Invalid token"});
    }
}

module.exports = auth;