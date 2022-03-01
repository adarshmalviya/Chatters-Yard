const asyncHandler = require('express-async-handler')
const Joi = require('joi')
const generateToken = require('../config/generateToken')
const User = require('../models/userModel')
const bcrypt = require('bcrypt')

// SignUp
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body
    // Validation
    const { error } = validateUserSignUp(req.body);
    if (error) {
        res.status(400);
        throw new Error(error.details[0].message)
    };

    // Find if user already exists
    let user = await User.findOne({ email });
    if (user) {
        res.status(403)
        throw new Error("User already exists")
    };

    // Creating User
    user = new User({
        name,
        email,
        password,
        pic
    })
    user.save()
        .then(() => {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                pic: user.pic,
                token: generateToken(user._id)
            })
        })
        .catch((error) => {
            res.status(500);
            throw new Error("Server Error")
        })
});

function validateUserSignUp(req) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(20).required(),
        email: Joi.string().min(5).max(30).required().email(),
        password: Joi.string().min(5).max(255).required(),
        pic: Joi.string().allow('').optional()
    })
    return schema.validate(req);
}

// SignIn
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate Input
    if (!email | !password) {
        res.status(400);
        throw new Error("Please Enter all the feilds")
    }

    // Find User
    const user = await User.findOne({ email })
    if (!user) {
        res.status(400);
        throw new Error('User does not exists.')
    }

    // Validate Password
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
        res.status(422);
        throw new Error('Invalid Email or Password')
    }

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id)
    })
})


// Search All users 
//  /api/user?search=adarsh
const allUsers = asyncHandler(async (req, res) => {
    const keyWord = req.query.search
        ? {
            $or: [
                { name: { $regex: '^' + req.query.search, $options: 'i' } },
                { email: { $regex: '^' + req.query.search, $options: 'i' } },
            ]
        }
        : {};

    const users = await User.find(keyWord).find({ _id: { $ne: req.user._id } });
    res.send(users);
})
module.exports = { registerUser, authUser, allUsers };