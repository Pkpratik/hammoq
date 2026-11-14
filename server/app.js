const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const tasks = require('./routes/tasks');
const { notFound, errorHandler } = require('./middleware/error');

const app = express();
app.use(helmet());
app.use(cors({ origin: (process.env.CLIENT_ORIGIN || '*').split(',') }));
app.use(express.json({ limit: '10kb' }));
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/tasks', tasks);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
