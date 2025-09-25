export function notFoundHandler(_req, res) {
  res.status(404).json({ message: 'Resource not found' });
}

export function errorHandler(err, _req, res, _next) {
  console.error(err);

  const status = err.statusCode ?? err.status ?? 500;
  const message =
    status >= 500
      ? 'Something went wrong on the server. Please try again later.'
      : err.message || 'Request failed';

  res.status(status).json({ message, details: err.details ?? undefined });
}
