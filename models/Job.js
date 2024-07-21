const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    company: {
        type: String, 
        required: [true, 'Company is required'],
        maxlength: 50
    },
    position: {
        type: String, 
        required: [true, 'Position is required'],
        maxlength: 100
    },
    status: {
        type: String,
        enum: ['interview', 'declined', 'pending'],
        default: 'pending'
    },
    createdBy: {
        type: mongoose.Types.ObjectId, // The value of '_id' field of a document
        ref: 'User', // reference to 'User' model
        required: [true, 'User is required']
    }
}, { timestamps: true }); // This automatically adds 'createdAt' and 'updatedAt' fields to JobSchema, they are set when the document is created and updated!
 
module.exports = mongoose.model('Job', JobSchema);