const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const db = require('./db');
const api = supertest(app);
const testBlogs = require('./blogs.json');
const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const testUsers = require('./users.json');
const loginHelper = require('./login.helper');
const testUsername = 'adaldrida.brandybuck';

beforeAll(async () => {
  await db.connect();
}, 120000);

beforeEach(async () => {
  await db.clear();
  // Hash all the passwords in the test user file and create new array that can be inserted.
  const updatedTestUsers = await Promise.all(testUsers.map(async user => ({
    username: user.username,
    name: user.name,
    passwordHash: await bcrypt.hash(user.password, 10),
  })));
  await User.insertMany(updatedTestUsers);

  // Get the test user from the collection
  const testUser = await User.findOne({ username: testUsername });

  // Add the test user as "user" on all the blog entries to be saved.
  testBlogs.forEach(blog => {
    blog.user = mongoose.Types.ObjectId(testUser.id);
  });
  await Blog.insertMany(testBlogs);

  // Get all the blogs and make an array of their ObjectIds
  const blogs = await Blog.find({});
  const blogRefs = blogs.map(blog => mongoose.Types.ObjectId(blog.id));
  // Add the array of blog ObjectIds to the test user
  await User.findOneAndUpdate({ _id: testUser.id }, { blogs: blogRefs });
});

afterAll(async () => {
  await db.close();
});

describe('Fetch all blogs', () => {
  test('returns correct count', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body.length).toBe(6);
  });
  test('instances have id instead of _id', async () => {
    const response = await api.get('/api/blogs');
    response.body.forEach(blog => {
      expect(blog.id).toBeDefined();
      expect(blog._id).not.toBeDefined();
    });
  });
});

describe('Fetch blog by id', () => {
  test('fetches correct blog', async () => {
    const allBlogsResponse = await api.get('/api/blogs');
    const blogToFetch = allBlogsResponse.body[0];
    const fetchResponse = await api.get(`/api/blogs/${blogToFetch.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    const fetchedBlog = { ...fetchResponse.body };
    expect(fetchedBlog).toMatchObject(blogToFetch);
  });
});

describe('Add blog', () => {
  test('add blog succeeds - base', async () => {
    const loginUser = testUsers.slice(-1)[0];
    const { loginToken, loginUserId } = await loginHelper.login(loginUser.username, loginUser.password);

    const newBlog = {
      title: 'Best Stuffs',
      author: 'Blim Blam',
      url: 'https://www.amazon.com/Lost-Mens-Blim-Blam-Boardshort/product-reviews/B007WSCPTM?reviewerType=all_reviews',
      likes: 10,
    };
    const response = await api.post('/api/blogs').send(newBlog)
      .set('Authorization', `Bearer ${loginToken}`)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    expect(response.body.id).toBeDefined();
    const allBlogs = await api.get('/api/blogs');
    expect(allBlogs.body.length).toBe(7);
    expect(response.body.user).toBe(loginUserId);

    const testUser = await User.findById(loginUserId);
    expect(testUser.blogs.length).toBe(1);
    expect(testUser.blogs.map(idObject => idObject.toString())).toContainEqual(response.body.id);
  });
  test('add blog succeeds with missing likes property', async () => {
    const loginUser = testUsers.slice(-1)[0];
    const { loginToken } = await loginHelper.login(loginUser.username, loginUser.password);

    const newBlog = {
      title: 'OIDC - Identifying the Resource Server',
      author: 'John Lednicky',
      url: 'https://stackoverflow.com/a/69578253/4628416',
    };
    const response = await api.post('/api/blogs').send(newBlog)
      .set('Authorization', `Bearer ${loginToken}`)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    expect(response.body.id).toBeDefined();
    const newBlogId = response.body.id;
    const fetchResponse = await api.get(`/api/blogs/${newBlogId}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    const fetchedBlog = { ...fetchResponse.body };
    expect(fetchedBlog.likes).toBe(0);
  });
  test('add blog fails with missing title property', async () => {
    const loginUser = testUsers.slice(-1)[0];
    const { loginToken } = await loginHelper.login(loginUser.username, loginUser.password);

    const newBlog = {
      author: 'John Lednicky',
      url: 'https://stackoverflow.com/a/69578253/4628416',
    };
    await api.post('/api/blogs').send(newBlog)
      .set('Authorization', `Bearer ${loginToken}`)
      .expect(400);
  });
  test('add blog fails with missing author property', async () => {
    const loginUser = testUsers.slice(-1)[0];
    const { loginToken } = await loginHelper.login(loginUser.username, loginUser.password);

    const newBlog = {
      title: 'OIDC - Identifying the Resource Server',
      url: 'https://stackoverflow.com/a/69578253/4628416',
    };
    await api.post('/api/blogs').send(newBlog)
      .set('Authorization', `Bearer ${loginToken}`)
      .expect(400);
  });
});

describe('Deletes blog by id', () => {
  test('deletes correct blog', async () => {
    const allBlogsResponse = await api.get('/api/blogs');
    const loginUser = testUsers.find(user => user.username === allBlogsResponse.body[0].user.username);
    const { loginToken } = await loginHelper.login(loginUser.username, loginUser.password);

    const blogToDelete = allBlogsResponse.body[0];
    await api.delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${loginToken}`)
      .expect(204);
    const modifiedBlogsResponse = await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
    expect(modifiedBlogsResponse.body.length).toBe(5);
    const testUser = await User.findOne({ username: testUsername });
    expect(testUser.blogs.length).toBe(5);
  });
  test('cannot delete someone elses blog', async () => {
    const allBlogsResponse = await api.get('/api/blogs');
    const blogToDelete = allBlogsResponse.body[0];

    const loginUser = testUsers.find(user => user.username !== blogToDelete.user.username);
    const { loginToken } = await loginHelper.login(loginUser.username, loginUser.password);

    await api.delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${loginToken}`)
      .expect(403);
  });
  test('attempted deletion of non-existent id', async () => {
    const loginUser = testUsers.slice(-1)[0];
    const { loginToken } = await loginHelper.login(loginUser.username, loginUser.password);

    await api.delete('/api/blogs/618aecba2d6a6a0dd730430a')
      .set('Authorization', `Bearer ${loginToken}`)
      .expect(404);
    const modifiedBlogsResponse = await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
    expect(modifiedBlogsResponse.body.length).toBe(6);
    const testUser = await User.findOne({ username: testUsername });
    expect(testUser.blogs.length).toBe(6);
  });
});

test('Deleting user deletes associated blogs', async () => {
  await api.delete(`/api/users/${testUsername}`)
    .expect(204);
  const results = await Blog.find({});
  expect(results.length).toBe(0);
});

describe('updates blog by id', () => {
  test('updates blog - base', async () => {
    const allBlogsResponse = await api.get('/api/blogs');
    const blogToUpdate = { ...allBlogsResponse.body[0] };

    const loginUser = testUsers.find(user => user.username === blogToUpdate.user.username);
    const { loginToken } = await loginHelper.login(loginUser.username, loginUser.password);

    blogToUpdate.author = 'Minty Bongwater';
    blogToUpdate.title = 'About Me';
    blogToUpdate.url = 'https://www.mintybongwater.com/';
    blogToUpdate.likes = 20;
    const modifiedBlogResponse = await api.put(`/api/blogs/${blogToUpdate.id}`).send(blogToUpdate)
      .set('Authorization', `Bearer ${loginToken}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    expect(modifiedBlogResponse.body.id).toBe(blogToUpdate.id);
    expect(modifiedBlogResponse.body.author).toBe(blogToUpdate.author);
    expect(modifiedBlogResponse.body.title).toBe(blogToUpdate.title);
    expect(modifiedBlogResponse.body.url).toBe(blogToUpdate.url);
    expect(modifiedBlogResponse.body.likes).toBe(20);
    const fetchResponse = await api.get(`/api/blogs/${blogToUpdate.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    const fetchedBlog = { ...fetchResponse.body };
    expect(fetchedBlog.id).toBe(blogToUpdate.id);
    expect(fetchedBlog.author).toBe(blogToUpdate.author);
    expect(fetchedBlog.title).toBe(blogToUpdate.title);
    expect(fetchedBlog.url).toBe(blogToUpdate.url);
    expect(fetchedBlog.likes).toBe(20);
  });
  test('cannot update someone elses blog', async () => {
    const allBlogsResponse = await api.get('/api/blogs');
    const blogToUpdate = { ...allBlogsResponse.body[0] };

    const loginUser = testUsers.find(user => user.username !== blogToUpdate.user.username);
    const { loginToken } = await loginHelper.login(loginUser.username, loginUser.password);

    blogToUpdate.author = 'Minty Bongwater';
    blogToUpdate.title = 'About Me';
    blogToUpdate.url = 'https://www.mintybongwater.com/';
    blogToUpdate.likes = 20;
    await api.put(`/api/blogs/${blogToUpdate.id}`).send(blogToUpdate)
      .set('Authorization', `Bearer ${loginToken}`)
      .expect(403);
  });

  test('patches blog with missing author', async () => {
    const allBlogsResponse = await api.get('/api/blogs');
    const blogToUpdate = { ...allBlogsResponse.body[0] };

    const loginUser = testUsers.find(user => user.username === blogToUpdate.user.username);
    const { loginToken } = await loginHelper.login(loginUser.username, loginUser.password);

    delete blogToUpdate.author;
    blogToUpdate.likes = 500;
    const modifiedBlogResponse = await api.put(`/api/blogs/${blogToUpdate.id}`).send(blogToUpdate)
      .set('Authorization', `Bearer ${loginToken}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    expect(modifiedBlogResponse.body.id).toBe(blogToUpdate.id);
    expect(modifiedBlogResponse.body.title).toBe(blogToUpdate.title);
    expect(modifiedBlogResponse.body.url).toBe(blogToUpdate.url);
    expect(modifiedBlogResponse.body.likes).toBe(500);
  });
  test('fails validation with null author', async () => {
    const allBlogsResponse = await api.get('/api/blogs');
    const blogToUpdate = { ...allBlogsResponse.body[0] };

    const loginUser = testUsers.find(user => user.username === allBlogsResponse.body[0].user.username);
    const { loginToken } = await loginHelper.login(loginUser.username, loginUser.password);

    blogToUpdate.author = null;
    blogToUpdate.likes = 500;
    await api.put(`/api/blogs/${blogToUpdate.id}`).send(blogToUpdate)
      .set('Authorization', `Bearer ${loginToken}`)
      .expect(400);
  });
  test('fails validation with null title', async () => {
    const allBlogsResponse = await api.get('/api/blogs');
    const blogToUpdate = { ...allBlogsResponse.body[0] };

    const loginUser = testUsers.find(user => user.username === allBlogsResponse.body[0].user.username);
    const { loginToken } = await loginHelper.login(loginUser.username, loginUser.password);

    blogToUpdate.title = null;
    blogToUpdate.likes = 500;
    await api.put(`/api/blogs/${blogToUpdate.id}`).send(blogToUpdate)
      .set('Authorization', `Bearer ${loginToken}`)
      .expect(400);
  });
  test('attempted update of non-existent id', async () => {
    const loginUser = testUsers.slice(-1)[0];
    const { loginToken } = await loginHelper.login(loginUser.username, loginUser.password);

    await api.put('/api/blogs/618aecba2d6a6a0dd730430a')
      .set('Authorization', `Bearer ${loginToken}`)
      .expect(404);
  });
});

