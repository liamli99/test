const mongoose = require('mongoose');
const bcript = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    // All SchemaTypes have built-in validators!
    name: {
        type: String, 
        required: [true, 'Name is required'],
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide valid email'], // Check if the value matches the given regular expression!
        unique: true // Different users should have different emails!
    },
    password: {
        type: String, 
        required: [true, 'Password is required'],
        minlength: 6
    }
});

// This is a mongoose middleware that is executed before a document is saved to the database!
// Note that we must use the traditional function instead of the arrow function! Because in traditional function, 'this' refers to the current document!
// https://mongoosejs.com/docs/middleware.html
UserSchema.pre('save', async function() {
    // Hash the password
    const salt = await bcript.genSalt(10);
    this.password = await bcript.hash(this.password, salt);
});

// This is a mongoose instance method that can create token for the user! This method is added to the schema and is available on all instances of the User model (instances of model are documents)! 
// Note that we must use the traditional function instead of the arrow function! Because in traditional function, 'this' refers to the current document!
// https://mongoosejs.com/docs/guide.html#methods
UserSchema.methods.createJWT = function() {
    const payload = {
        userId: this._id,
        userName: this.name
    };
    
    const secret = process.env.JWT_SECRET;
    
    const token = jwt.sign(payload, secret, {
        expiresIn: process.env.JWT_LIFETIME
    });

    return token;
} 

// This is a mongoose instance method that can check the password for the user!
UserSchema.methods.comparePassword = function(password) {
    const isMatch = bcript.compare(password, this.password);
    
    // Note that isMatch is a Promise!
    return isMatch;
}

// OR
// UserSchema.methods.comparePassword = async function(password) {
//     const isMatch = await bcript.compare(password, this.password);
    
//     // Note that isMatch is a Boolean! However, since this is an async function, the return value is actually a Promise that resolves with this boolean value!!! So that we should still use 'await user.comparePassword(password)' in auth.js!
//     return isMatch;
// }

module.exports = mongoose.model('User', UserSchema);