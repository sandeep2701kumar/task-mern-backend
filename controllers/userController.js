const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const generateToken = (id) => {
    return jwt.sign({id}, process.env.jwt_secret, {expiresIn: '5d'});
}
const registerUser = asyncHandler(async(req, res) => {
    const {name, email, password} = req.body;
    
    if(!name || !email || !password){
        res.status(400);
        throw new Error('All fields are mandatory');
    }

    const userAvailable = await User.findOne({ email });
    if(userAvailable){
        res.status(400);
        throw new Error('user already exists');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });
    if(user){
        res.status(201).json({
            _id: user.id, 
            name: user.name, 
            email: user.email,
            token: generateToken(user.id)
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

const loginUser = asyncHandler(async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});

    if(user && (await bcrypt.compare(password, user.password))){
        res.json({
            _id: user.id, 
            name: user.name, 
            email: user.email,
            token: generateToken(user.id)
        });
    } else {
        res.status(400);
        throw new Error('Invalid credentials');
    }
});

const getCurrentUser = asyncHandler(async(req, res) => {
    const {_id, name, email} = await User.findById(req.user.id);
    res.status(200).json({
        id: _id,
        name,
        email
    });
});

module.exports = {registerUser, loginUser, getCurrentUser};
