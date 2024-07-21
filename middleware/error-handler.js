const { CustomError } = require('../errors/index');
const { StatusCodes } = require('http-status-codes');

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ msg: err.message });
  
  // Make errors more readable!

  // Duplicate error: If you create/update a document with a value that already exists in the unique index field!
  // This happens when we register a user with the same email!
  } else if (err.code && err.code === 11000) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: `Duplicate value entered for ${Object.keys(err.keyValue)}` });

  // Validation error: If you create/update a document that does not match the validation rules in the schema!
  // This happens when we register a user, create a job, or update a job, and req.body doesn't match the validation rules!
  } else if (err.name === 'ValidationError') {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: Object.values(err.errors).map(item => item.message).join(', ') });
  
  // Cast error: If mongoose fails to cast a value
  // This happens when we get a job, update a job, or delete a job, and req.params.id has wrong syntax (different length from the correct id)!
  } else if (err.name === 'CastError') {
    res.status(StatusCodes.NOT_FOUND).json({ msg: `No item found with id: ${err.value}` });
  }
  
  else {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err })
  }
}

module.exports = errorHandler;
