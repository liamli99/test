const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthorizedError } = require('../errors/index');

// POST /api/v1/auth/register
const register = async (req, res) => {
    // We should not store the original password into the database! Instead, we should hash the original password and store the hashed password! This is because if the database is leaked, the hacker cannot know the original password because hashing is a one-way function!!! We can do this in 'models/User.js' using mongoose middleware!!!

    // We need to create token for each registered user! Different from the JWT project, here we can do this in 'models/User.js' using mongoose instance method!!!


    // Note that the rejected error also includes violations against schema validation rules in 'models/User.js'! So that name, email, and password are validated using mongoose SchemaType validators!
    // Note that req.body.password will be hashed before saving to the database using mongoose middleware!
    const user = await User.create(req.body);

    // Here user is the created document, it has an instance method 'createJWT' to create token for user!
    const token = user.createJWT();

    res.status(StatusCodes.CREATED).json({ user, token });
}

// POST /api/v1/auth/login
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError('Please provide your email and password');
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new UnauthorizedError('User Not Found');
    }

    // Check the password using the mongoose instance method
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new UnauthorizedError('Password Not Correct');
    }

    // Create the token for user using the mongoose instance method
    const token = user.createJWT();

    res.status(StatusCodes.OK).json({ user, token });
}

module.exports = { register, login };