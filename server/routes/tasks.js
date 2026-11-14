const express = require('express');
const Task = require('../models/Task');

const router = express.Router();
const FIELDS = ['title', 'description', 'status', 'priority', 'dueDate'];

// Whitelist fields so clients can't set arbitrary properties.
const pick = (body) =>
  Object.fromEntries(FIELDS.filter((f) => body && body[f] !== undefined).map((f) => [f, body[f]]));

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

router.get('/', async (req, res, next) => {
  try {
    const { status, q } = req.query;
    const filter = {};
    if (['todo', 'done'].includes(status)) filter.status = status;
    if (q) filter.title = { $regex: escapeRegex(String(q)), $options: 'i' };
    res.json(await Task.find(filter).sort({ createdAt: -1 }));
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    res.status(201).json(await Task.create(pick(req.body)));
  } catch (e) { next(e); }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, pick(req.body), {
      returnDocument: 'after',
      runValidators: true,
    });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.status(204).end();
  } catch (e) { next(e); }
});

module.exports = router;
