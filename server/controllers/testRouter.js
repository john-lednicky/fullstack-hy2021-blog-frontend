/* eslint-disable no-await-in-loop */
const bcrypt = require('bcrypt');
const testRouter = require('express').Router();
const Blog = require('../models/blogModel');
const { addBlogIdToUser } = require('./blogRouterUtil');
const User = require('../models/userModel');

const users = [
  {
    username: 'adaldrida.brandybuck',
    name: 'Adaldrida Brandybuck',
    password: 'one ring to rule them all',
  },
  {
    username: 'bandobras.took',
    name: 'Bandobras Took',
    password: 'one ring to find them',
  },
  {
    username: 'chica.baggins',
    name: 'Chica Baggins',
    password: 'one ring to find them',
  },
  {
    username: 'daisy.gamgee',
    name: 'Daisy Gamgee',
    password: 'and in the darkness bind them',
  },
];

const blogs = [
  {
    title: 'Things You Should Never Do, Part I',
    author: 'Joel Spolsky',
    url: 'https://www.joelonsoftware.com/2000/04/06/things-you-should-never-do-part-i/',
    likes: 2,
    user: 'adaldrida.brandybuck',
  },
  {
    title: 'The Iceberg Secret, Revealed',
    author: 'Joel Spolsky',
    url: 'https://www.joelonsoftware.com/2002/02/13/the-iceberg-secret-revealed/',
    likes: 3,
    user: 'adaldrida.brandybuck',
  },
  {
    title: 'The Guerrilla Guide to Interviewing',
    author: 'Joel Spolsky',
    url: 'https://www.joelonsoftware.com/2006/10/25/the-guerrilla-guide-to-interviewing-version-30/',
    likes: 4,
    user: 'daisy.gamgee',
  },
  {
    title: 'Funky Like a Skunk',
    author: 'Betty Davis',
    url: 'https://www.youtube.com/watch?v=pnHxT0rrl6E',
    likes: 5,
    user: 'daisy.gamgee',
  },
];

testRouter.post('/clear', async (req, res) => {
  await Blog.deleteMany();
  await User.deleteMany();
  res.status(204).end();
});

testRouter.post('/seed/all', async (req, res) => {
  await seedUsers();
  await seedBlogs();
  res.status(204).end();
});

testRouter.post('/seed/users', async (req, res) => {
  try {
    await seedUsers();
    res.json(users);
  } catch (err) {
    console.dir(err);
    res.status(500).end();
  }
});

testRouter.post('/seed/blogs', async (req, res) => {
  try {
    await seedBlogs();
    const returnValue = await Blog.find({}).populate('user');
    res.json(returnValue);
  } catch (err) {
    console.dir(err);
    res.status(500).end();
  }
});

const seedUsers = async () => {
  await User.deleteMany();
  const saltRounds = 10;
  for (const user of users) {
    const passwordHash = await bcrypt.hash(user.password, saltRounds);
    const newUser = new User({
      username: user.username,
      name: user.name,
      passwordHash,
    });
    const savedUser = await newUser.save();
    user.id = savedUser.id;
  }
  return users;
};

const seedBlogs = async () => {
  const users = await User.find({});
  await Blog.deleteMany();

  const blogsToAdd = blogs.map(blog => ({
    ...blog,
    user: users.find(user => user.username === blog.user)?.id,
  }));
  if (blogsToAdd.find(blog => !blog.user)) {
    throw Error('blog username not found');
  }

  for (const blog of blogsToAdd) {
    const blogToAdd = new Blog(blog);
    const savedBlog = await blogToAdd.save();
    await addBlogIdToUser(savedBlog.id, blog.user);
  }
};
testRouter.get('/users', async (req, res) => {
  res.json(users);
});

module.exports = testRouter;
