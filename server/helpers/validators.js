// responseHelper.js

const { validationResult, check } = require('express-validator');

// Helper function to handle API responses
const sendResponse = (res, status, data, message, errors = null) => {
  return res.status(status).json({ status, data, message, errors });
};

// Middleware to handle validation errors from express-validator
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => {
      return { [error.param]: error.msg };
    });
    return sendResponse(res, 400, null, 'Validation errors', errorMessages);
  }
  next();
};

const registerValidator = () => {
  return [
    check('name').notEmpty().withMessage('First Name is required'),
    check('email').isEmail().withMessage('Email is not valid'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ];
};

const loginValidator = () => {
  return [
    check('email').isEmail().withMessage('Email is not valid'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ];
};

module.exports = { sendResponse, handleValidationErrors, registerValidator, loginValidator };
