const mongoose = require('mongoose');
const blogRouter = require('express').Router();
const Blog = require('../models/blogModel');
const { removeBlogFromUser, addBlogIdToUser } = require('./blogRouterUtil');
const middleware = require('../utils/middleware');

blogRouter.get('/', async (req, res) => {
  const results = await Blog.find({}).populate('user');
  res.json(results).end();
});

blogRouter.get('/:id', async (req, res) => {
  const fetchedBlog = await Blog.findById(req.params.id).populate('user');
  if (fetchedBlog) {
    res.json(fetchedBlog);
  } else {
    res.status(404).end();
  }
});

blogRouter.post('/', middleware.verifyToken, async (req, res) => {
  const blogToAdd = {
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: req.body.likes,
    user: mongoose.Types.ObjectId(req.userid),
  };
  const blog = new Blog(blogToAdd);
  const savedBlog = await blog.save();
  addBlogIdToUser(savedBlog.id, blog.user);
  res.status(201).json(savedBlog.toJSON()).end();
});

blogRouter.put('/:id', middleware.verifyToken, async (req, res) => {
  const blogToUpdate = await Blog.findById(req.params.id);
  if (blogToUpdate) {
    const { author, title, url, likes } = req.body;
    const updates = { author, title, url, likes };
    /* Only the creator can update author, title, and url. Everyone can update likes. */
    if (blogToUpdate.user.toString() === req.userid
      || (!updates.author && !updates.title && !updates.url)
      || (blogToUpdate.author === updates.author && blogToUpdate.title === updates.title && blogToUpdate.url === updates.url)
    ) {
      const updatedBlog = await Blog.findOneAndUpdate({ _id: req.params.id }, updates, { new: true, runValidators: true });
      if (updatedBlog) {
        res.json(updatedBlog.toJSON());
      }
    } else {
      res.status(403).end();
    }
  } else {
    res.status(404).end();
  }
});

blogRouter.delete('/:id', middleware.verifyToken, async (req, res) => {
  const blogToRemove = await Blog.findById(req.params.id);
  if (blogToRemove) {
    if (blogToRemove.user.toString() === req.userid) {
      const result = await Blog.findByIdAndRemove(req.params.id);
      if (result) {
        removeBlogFromUser(result.id, result.user);
        res.status(204).end();
      }
    } else {
      res.status(403).end();
    }
  } else {
    res.status(404).end();
  }
});

module.exports = blogRouter;
