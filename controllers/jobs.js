const Job = require('../models/Job');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors/index');

// Note that in app.js we load authentication middleware before jobsRouter to verify the token before creating/reading/updating/deleting the job! So that all the requests' headers must include 'Authorization: Bearer <token>'!!! Here '<token>' is created during authRouter (register and login)! In order to save time, in Postman, we can write Post-response Script in register and login to automatically save the created token as global variable, then in job-related routes, we can simply add this token in Authorization instead of manually adding it in Headers!!!

// The authentication middleware verifies the token to get the decoded payload, then creates 'req.user' which contains user information extracted from the decoded payload!

// POST /api/v1/jobs, create a job for a specific user
// We don't have to include 'createdBy' field in req.body, because it is provided by 'req.user.userId'!
const createJob = async (req, res) => {
    // Note that 'req.user' is created during authentication middleware!
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    
    res.status(StatusCodes.CREATED).json({ job });
}

// GET /api/v1/jobs, get all jobs for a specific user
const getAllJobs = async (req, res) => {
    const jobs = await Job.find({ createdBy: req.user.userId }).sort('-createdAt');
    
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
}

// GET /api/v1/jobs/:id, get a job for a specific user
const getJob = async (req, res) => {
    const { id } = req.params;
    const job = await Job.findOne({ createdBy: req.user.userId, _id: id });

    // This executes when the id has correct syntax (same length as the correct id) but incorrect value!
    if (!job) {
        throw new NotFoundError('Job Not Found');
    }

    res.status(StatusCodes.OK).json({ job });
}

// PATCH /api/v1/jobs/:id
const updateJob = async (req, res) => {
    const { id } = req.params;
    const job = await Job.findOneAndUpdate({ createdBy: req.user.userId, _id: id }, req.body, {
        new: true, 
        runValidators: true
    });

    if (!job) {
        throw new NotFoundError('Job Not Found');
    }

    res.status(StatusCodes.OK).json({ job });
}

// DELETE /api/v1/jobs/:id
const deleteJob = async (req, res) => {
    const { id } = req.params;
    const job = await Job.findOneAndDelete({ createdBy: req.user.userId, _id: id });

    if (!job) {
        throw new NotFoundError('Job Not Found');
    }

    res.status(StatusCodes.OK).json({ job });
}

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };