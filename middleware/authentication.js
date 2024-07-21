const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/index');

// Create a middleware that can verify the token before creating/reading/updating/deleting the job! So that this middleware should be loaded before all job-related routes! An easier way is to load this middleware before jobsRouter in app.js!
// All the requests' headers must include 'Authorization: Bearer <token>'!!!
const authentication = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
        throw new UnauthorizedError('No token provided');
    }

    const token = authorization.split(' ')[1];

    // Verify the token
    // Note that token is created during authRouter (register and login)!
    try {
        // If the token is valid, then return the decoded payload ({ userId: ..., userName: ... }) used in signing the token!
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Modify the request object! So that we can access the user information in the next middleware!
        req.user = { userId: decoded.userId, userName: decoded.userName };
        // Pass to the next middleware, which are all job-related routes (jobsRouter) in this project!
        next();
    } catch (error) {
        throw new UnauthorizedError('Not authorized');
    }
}

module.exports = authentication;