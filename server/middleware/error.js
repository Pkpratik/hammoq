function notFound(req, res) {
  res.status(404).json({ error: 'Not found' });
}

// Central error handler: maps Mongoose errors to clean 4xx responses.
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: 'Validation failed', details });
  }
  if (err.name === 'CastError') return res.status(400).json({ error: 'Invalid id or value' });
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON body' });
  console.error(err);
  res.status(500).json({ error: 'Server error' });
}

module.exports = { notFound, errorHandler };
