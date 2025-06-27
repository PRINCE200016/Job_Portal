const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  
  const defaultError = {
    statusCode: err.statusCode || 500,
    message: err.message || 'Something went wrong, try again later',
  };

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    defaultError.statusCode = 400;
    defaultError.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(', ');
  }

  // Mongoose duplicate key error
  if (err.code && err.code === 11000) {
    defaultError.statusCode = 400;
    defaultError.message = `${Object.keys(
      err.keyValue
    )} field must be unique`;
  }

  // Mongoose cast error (invalid ID)
  if (err.name === 'CastError') {
    defaultError.statusCode = 404;
    defaultError.message = `No item found with id: ${err.value}`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    defaultError.statusCode = 401;
    defaultError.message = 'Invalid token, please log in again';
  }

  // JWT expired error
  if (err.name === 'TokenExpiredError') {
    defaultError.statusCode = 401;
    defaultError.message = 'Your session has expired, please log in again';
  }

  res
    .status(defaultError.statusCode)
    .json({ message: defaultError.message });
};

module.exports = errorHandlerMiddleware; 