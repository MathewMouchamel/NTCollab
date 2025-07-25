// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Default error response
  const errorResponse = {
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  };
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    errorResponse.error = 'Validation Error';
    errorResponse.message = err.message;
    return res.status(400).json(errorResponse);
  }
  
  if (err.name === 'UnauthorizedError') {
    errorResponse.error = 'Unauthorized';
    errorResponse.message = 'Authentication required';
    return res.status(401).json(errorResponse);
  }
  
  res.status(500).json(errorResponse);
};

// Async error wrapper
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};