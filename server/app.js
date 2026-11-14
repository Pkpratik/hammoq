const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const tasks = require('./routes/tasks');
const { notFound, errorHandler } = require('./middleware/error');

const app = express();
app.use(helmet());
// CLIENT_ORIGIN may hold several comma-separated origins. Trim spaces and trailing
// slashes so a small typo in the env var doesn't silently break CORS.
const allowedOrigins = (process.env.CLIENT_ORIGIN || '*')
  .split(',')
  .map((o) => o.trim().replace(/\/+$/, ''))
  .filter(Boolean);
app.use(cors({ origin: allowedOrigins.includes('*') ? '*' : allowedOrigins }));
app.use(express.json({ limit: '10kb' }));
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/tasks', tasks);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
