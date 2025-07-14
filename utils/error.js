// utils/error.js
const errorHandler = (statusCode, message) => {
    const error = new Error(message); // ✅ correct
    error.statusCode = statusCode;
    return error;
  };
  
  module.exports = errorHandler;
  