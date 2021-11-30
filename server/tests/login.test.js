const supertest = require('supertest');
const app = require('../app');
const db = require('./db');
const api = supertest(app);
const jwt = require('jsonwebtoken');

beforeAll(async () => {
  await db.connect();
}, 120000);

beforeEach(async () => {
  await db.clear();
});

afterAll(async () => {
  await db.close();
});

describe('Login', () => {
  test('is successful', async () => {
    const newUser = {
      username: 'hamfast.gamgee',
      name: 'Hamfast Gamgee',
      password: 'ash nazg thrakatulk',
    };
    const addUserResponse = await api.post('/api/users').send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    expect(addUserResponse.body.username).toBeDefined();

    const login = {
      username: newUser.username,
      password: newUser.password,
    };
    const response = await api.post('/api/login').send(login)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    expect(response.body.token).toBeDefined();
    expect(response.body.username).toBe(newUser.username);
    expect(response.body.name).toBe(newUser.name);
    const { token } = response.body;
    const decodedToken = jwt.verify(token, process.env.JWT_SIGNATURE);
    expect(decodedToken.username).toBe(newUser.username);
    expect(decodedToken.userid).toBe(addUserResponse.body.id);
  });
  test('fails - wrong password', async () => {
    const newUser = {
      username: 'hamfast.gamgee1',
      name: 'Hamfast Gamgee',
      password: 'ash nazg thrakatulk',
    };
    const addUserResponse = await api.post('/api/users').send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    expect(addUserResponse.body.username).toBeDefined();

    const login = {
      username: newUser.username,
      password: 'wrong password',
    };
    await api.post('/api/login').send(login)
      .expect(401);
  });
  test('fails - missing password', async () => {
    const newUser = {
      username: 'hamfast.gamgee2',
      name: 'Hamfast Gamgee',
      password: 'ash nazg thrakatulk',
    };
    const addUserResponse = await api.post('/api/users').send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    expect(addUserResponse.body.username).toBeDefined();

    const login = {
      username: newUser.username,
    };
    await api.post('/api/login').send(login)
      .expect(401);
  });
  test('fails - missing username', async () => {
    const newUser = {
      username: 'hamfast.gamgee3',
      name: 'Hamfast Gamgee',
      password: 'ash nazg thrakatulk',
    };
    const addUserResponse = await api.post('/api/users').send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    expect(addUserResponse.body.username).toBeDefined();

    const login = {
      password: 'ash nazg thrakatulk',
    };
    await api.post('/api/login').send(login)
      .expect(401);
  });
});

