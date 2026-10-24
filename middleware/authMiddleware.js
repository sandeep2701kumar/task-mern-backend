const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const protect = asyncHandler(async(req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1];
            const decode = jwt.verify(token, process.env.jwt_secret);
            req.user = await User.findById(decode.id).select('-password');
            next();
        }catch (error) {
            console.log(error);
            res.status(401);
            throw new Error('You are not authorized');
        }

        if(!token){
            res.status(401);
            throw new Error('No token, you are not authorized');
        }
    }
    else {
        res.status(401);
        throw new Error('No authorization key found, you are not authorized');
    }
})

module.exports = {protect};