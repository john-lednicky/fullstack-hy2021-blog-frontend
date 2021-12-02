global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;
const supertest = require('supertest');
const app = require('../app');
const db = require('./db');
const api = supertest(app);
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const testUsers = require('./users.json');

beforeAll(async () => {
  await db.connect();
}, 120000);

beforeEach(async () => {
  await db.clear();
  const testUsersWithPasswordHashes = await Promise.all(testUsers.map(async user => ({
    username: user.username,
    name: user.name,
    passwordHash: await bcrypt.hash(user.password, 10),
  })));
  await User.insertMany(testUsersWithPasswordHashes);
});

afterAll(async () => {
  await db.close();
});

describe('Fetch all users', () => {
  test('returns correct count', async () => {
    const response = await api.get('/api/users');
    expect(response.body.length).toBe(4);
  });
  test('instances have no _id', async () => {
    const response = await api.get('/api/users');
    response.body.forEach(user => {
      expect(user._id).not.toBeDefined();
    });
  });
  test('instances do not have passwordHash', async () => {
    const response = await api.get('/api/users');
    response.body.forEach(user => {
      expect(user.passwordHash).not.toBeDefined();
    });
  });
});

describe('Fetch user by username', () => {
  test('fetches correct user', async () => {
    const userToFetch = testUsers[0];
    const fetchResponse = await api.get(`/api/users/${userToFetch.username}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    const fetchedUser = { ...fetchResponse.body };
    expect(fetchedUser.username).toBe(userToFetch.username);
    expect(fetchedUser.name).toBe(userToFetch.name);
  });
  test('nonexistent username returns 404', async () => {
    await api.get('/api/users/non-existent-user')
      .expect(404);
  });
});

describe('Add user', () => {
  test('succeeds - base', async () => {
    const newUser = {
      username: 'hamfast.gamgee',
      name: 'Hamfast Gamgee',
      password: 'ash nazg thrakatulk',
    };
    const response = await api.post('/api/users').send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    expect(response.body.username).toBeDefined();
    const allUsers = await api.get('/api/users');
    expect(allUsers.body.length).toBe(5);
  });
  test('fails with missing username property', async () => {
    const newUser = {
      name: 'Halfred Greenhand',
      password: 'ash nazg thrakatulk',
    };
    await api.post('/api/users').send(newUser)
      .expect(400);
  });
  test('fails with missing name property', async () => {
    const newUser = {
      username: 'halfred.greenhand',
      password: 'ash nazg thrakatulk',
    };
    await api.post('/api/users').send(newUser)
      .expect(400);
  });
  test('fails with missing password property', async () => {
    const newUser = {
      name: 'Halfred Greenhand',
      username: 'halfred.greenhand',
    };
    await api.post('/api/users').send(newUser)
      .expect(400);
  });
  test('fails with invalid password property', async () => {
    const newUser = {
      name: 'Halfred Greenhand',
      username: 'halfred.greenhand',
      password: '23',
    };
    await api.post('/api/users').send(newUser)
      .expect(400);
  });
  test('fails with invalid username property', async () => {
    const newUser = {
      name: 'Halfred Greenhand',
      password: 'ash nazg thrakatulk',
    };
    const invalidUsernames = [
      'halfred greenhand',
      '.halfred.greenhand',
      'halfred.greenhand-',
      'halfred^greenhand',
      'ha',
    ];
    invalidUsernames.forEach(async username => {
      newUser.username = username;
      await api.post('/api/users').send(newUser)
        .expect(400);
    });
  });
});
describe('Deletes user by username', () => {
  test('deletes correct user', async () => {
    const initialUsersResponse = await api.get('/api/users');
    const initialUsers = initialUsersResponse.body;
    const userToDelete = initialUsers[0];
    await api.delete(`/api/users/${userToDelete.username}`)
      .expect(204);
    const modifiedUsersResponse = await api.get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);
    const modifiedUsers = modifiedUsersResponse.body;
    expect(modifiedUsers.length).toBe(initialUsers.length - 1);
  });
  test('attempted deletion of non-existent username', async () => {
    const initialUsersResponse = await api.get('/api/users');
    const initialUsers = initialUsersResponse.body;
    await api.delete('/api/users/non-existent-user')
      .expect(404);
    const modifiedUsersResponse = await api.get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);
    const modifiedUsers = modifiedUsersResponse.body;
    expect(modifiedUsers.length).toBe(initialUsers.length);
  });
});

describe('Update user by username', () => {
  test('updates user - base', async () => {
    const allUsersResponse = await api.get('/api/users');
    const initialUser = { ...allUsersResponse.body[0] };
    const userToUpdate = { ...initialUser };
    delete userToUpdate.id;
    userToUpdate.name = 'Minty Bongwater';
    userToUpdate.username = 'minty.bongwater';
    userToUpdate.password = 'terrEll-dAvis';
    const modifiedUserResponse = await api.put(`/api/users/${initialUser.username}`).send(userToUpdate)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    const modifiedUser = modifiedUserResponse.body;
    expect(modifiedUser.username).toBe(userToUpdate.username);
    expect(modifiedUser.name).toBe(userToUpdate.name);

    const fetchResponse = await api.get(`/api/users/${userToUpdate.username}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    const fetchedUser = { ...fetchResponse.body };
    expect(fetchedUser.id).toBe(initialUser.id);
    expect(fetchedUser.username).toBe(userToUpdate.username);
    expect(fetchedUser.name).toBe(userToUpdate.name);
  });
  test('patches user with missing username', async () => {
    const allUsersResponse = await api.get('/api/users');
    const initialUser = { ...allUsersResponse.body[0] };
    const userToUpdate = { ...initialUser };
    delete userToUpdate.id;
    userToUpdate.name = 'Minty Bongwater';
    userToUpdate.password = 'terrEll-dAvis';
    const modifiedUserResponse = await api.put(`/api/users/${initialUser.username}`).send(userToUpdate)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    const modifiedUser = modifiedUserResponse.body;
    expect(modifiedUser.username).toBe(initialUser.username);
    expect(modifiedUser.name).toBe(userToUpdate.name);

    const fetchResponse = await api.get(`/api/users/${userToUpdate.username}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    const fetchedUser = { ...fetchResponse.body };
    expect(fetchedUser.id).toBe(initialUser.id);
    expect(fetchedUser.username).toBe(initialUser.username);
    expect(fetchedUser.name).toBe(userToUpdate.name);
  });
  test('patches user with missing name', async () => {
    const allUsersResponse = await api.get('/api/users');
    const initialUser = { ...allUsersResponse.body[0] };
    const userToUpdate = { ...initialUser };
    delete userToUpdate.id;
    userToUpdate.username = 'minty.bongwater';
    userToUpdate.password = 'terrEll-dAvis';
    const modifiedUserResponse = await api.put(`/api/users/${initialUser.username}`).send(userToUpdate)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    const modifiedUser = modifiedUserResponse.body;
    expect(modifiedUser.username).toBe(userToUpdate.username);
    expect(modifiedUser.name).toBe(initialUser.name);

    const fetchResponse = await api.get(`/api/users/${userToUpdate.username}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    const fetchedUser = { ...fetchResponse.body };
    expect(fetchedUser.id).toBe(initialUser.id);
    expect(fetchedUser.username).toBe(userToUpdate.username);
    expect(fetchedUser.name).toBe(initialUser.name);
  });
  test('fails validation with null name', async () => {
    const allUsersResponse = await api.get('/api/users');
    const initialUser = { ...allUsersResponse.body[0] };
    const userToUpdate = { ...initialUser };
    delete userToUpdate.id;
    userToUpdate.name = null;
    userToUpdate.username = 'minty.bongwater';
    userToUpdate.password = 'terrEll-dAvis';
    await api.put(`/api/users/${initialUser.username}`).send(userToUpdate)
      .expect(400);
  });
  test('fails validation with null username', async () => {
    const allUsersResponse = await api.get('/api/users');
    const initialUser = { ...allUsersResponse.body[0] };
    const userToUpdate = { ...initialUser };
    delete userToUpdate.id;
    userToUpdate.username = null;
    userToUpdate.name = 'Minty Bongwater';
    userToUpdate.password = 'terrEll-dAvis';
    await api.put(`/api/users/${initialUser.username}`).send(userToUpdate)
      .expect(400);
  });
  test('fails validation with invalid usernames', async () => {
    const allUsersResponse = await api.get('/api/users');
    const initialUser = { ...allUsersResponse.body[0] };
    const userToUpdate = { ...initialUser };
    delete userToUpdate.id;
    userToUpdate.username = 'halfred greenhand';
    userToUpdate.name = 'Minty Bongwater';
    userToUpdate.password = 'terrEll-dAvis';
    await api.put(`/api/users/${initialUser.username}`).send(userToUpdate)
      .expect(400);
  });
  test('attempted update of non-existent username', async () => {
    await api.put('/api/users/nonexistentusername')
      .expect(404);
  });
});

