/**
 * Custom API Error class that extends the built-in Error class
 */
class CustomAPIError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CustomAPIError';
  }
}

/**
 * Bad Request Error (400)
 */
class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.name = 'BadRequestError';
    this.statusCode = 400;
  }
}

/**
 * Unauthorized Error (401)
 */
class UnauthorizedError extends CustomAPIError {
  constructor(message) {
    super(message || 'Authentication invalid');
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
  }
}

/**
 * Forbidden Error (403)
 */
class ForbiddenError extends CustomAPIError {
  constructor(message) {
    super(message || 'Not allowed to access this route');
    this.name = 'ForbiddenError';
    this.statusCode = 403;
  }
}

/**
 * Not Found Error (404)
 */
class NotFoundError extends CustomAPIError {
  constructor(message) {
    super(message || 'Resource not found');
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

/**
 * Conflict Error (409)
 */
class ConflictError extends CustomAPIError {
  constructor(message) {
    super(message || 'Conflict with current state');
    this.name = 'ConflictError';
    this.statusCode = 409;
  }
}

/**
 * Too Many Requests Error (429)
 */
class TooManyRequestsError extends CustomAPIError {
  constructor(message) {
    super(message || 'Too many requests, please try again later');
    this.name = 'TooManyRequestsError';
    this.statusCode = 429;
  }
}

module.exports = {
  CustomAPIError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  TooManyRequestsError,
};