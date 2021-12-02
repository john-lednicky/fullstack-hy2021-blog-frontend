const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);

const login = async (username, password) => {
  const login = {
    username,
    password,
  };
  const loginResponse = await api.post('/api/login').send(login)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const loginToken = loginResponse.body.token;
  const loginUserId = loginResponse.body.id;
  return { loginToken, loginUserId };
};

module.exports = {
  login,
};

