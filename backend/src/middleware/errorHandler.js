function notFound(req, res) {
  res.status(404).json({ message: 'Route not found.' });
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error.statusCode || 500;
  const message = statusCode === 500 ? 'An unexpected error occurred.' : error.message;
  return res.status(statusCode).json({ message });
}

module.exports = { notFound, errorHandler };
