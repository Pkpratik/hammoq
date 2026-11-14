process.env.NODE_ENV = 'test';
require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');

// Uses a separate database so real tasks are never touched.
beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: 'taskmanager_test' });
  await mongoose.connection.dropDatabase();
});
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

test('rejects task without title', async () => {
  const res = await request(app).post('/api/tasks').send({ description: 'x' });
  expect(res.status).toBe(400);
});

test('rejects invalid status', async () => {
  const res = await request(app).post('/api/tasks').send({ title: 'a', status: 'bogus' });
  expect(res.status).toBe(400);
});

test('create, update, filter, delete', async () => {
  const c = await request(app).post('/api/tasks').send({ title: 'Write docs', priority: 'high' });
  expect(c.status).toBe(201);
  const id = c.body._id;
  const u = await request(app).patch(`/api/tasks/${id}`).send({ status: 'done' });
  expect(u.body.status).toBe('done');
  const l = await request(app).get('/api/tasks?status=done&q=docs');
  expect(l.body).toHaveLength(1);
  expect((await request(app).delete(`/api/tasks/${id}`)).status).toBe(204);
  expect((await request(app).delete(`/api/tasks/${id}`)).status).toBe(404);
});
