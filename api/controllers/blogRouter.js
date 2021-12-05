const mongoose = require('mongoose');
const blogRouter = require('express').Router();
const Blog = require('../models/blogModel');
const {
  removeBlogFromUser,
  addBlogIdToUser,
  canUserMakeRequestedCommentUpdates,
} = require('./blogRouterUtil');
const middleware = require('../utils/middleware');

blogRouter.get('/', async (req, res) => {
  const results = await Blog.find({})
    .populate('user')
    .populate('comments.user');
  res.json(results).end();
});

blogRouter.get('/:id', async (req, res) => {
  const fetchedBlog = await Blog.findById(req.params.id)
    .populate('user')
    .populate('comments.user');
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
    comments:
      req.body.comments && Array.isArray(req.body.comments)
        ? req.body.comments.map((c) => ({
            ...c,
            user: mongoose.Types.ObjectId(req.userid),
          }))
        : [],
  };
  const blog = new Blog(blogToAdd);
  const savedBlog = await blog.save();
  addBlogIdToUser(savedBlog.id, blog.user);
  res.status(201).json(savedBlog.toJSON()).end();
});

blogRouter.put('/:id', middleware.verifyToken, async (req, res) => {
  const timestamp = new Date().toISOString();
  const blogToUpdate = await Blog.findById(req.params.id);
  if (blogToUpdate) {
    const { author, title, url, likes, comments } = req.body;
    const updates = { author, title, url, likes, comments };

    /* If the current user is not the author of the blog entry
    and the author, title, or url has updates, 
    forbid the action. */
    if (
      blogToUpdate.user.toString() !== req.userid &&
      (updates.author
        ? blogToUpdate.author !== updates.author
        : false || updates.title
        ? blogToUpdate.title !== updates.title
        : false || updates.url
        ? blogToUpdate.url !== updates.url
        : false)
    ) {
      res
        .status(403)
        .statusMessage(
          `The current user (${
            req.userid
          }) is not the author of the blog entry (${blogToUpdate.user.toString()}) and the author, title, or url has updates`
        )
        .end();
    }

    /* Add current user as author of any comments that do not have an author. */
    updates.comments = updates.comments.map((comment) =>
      comment.user
        ? comment
        : { ...comment, user: mongoose.Types.ObjectId(req.userid) }
    );

    /* Change to eagerly loaded users on existing comments to ObjectIds. */
    updates.comments = updates.comments.map((comment) =>
      comment.user.username
        ? { ...comment, user: mongoose.Types.ObjectId(comment.user.id) }
        : comment
    );

    /* Add current timestamp to any comments that do not have a createDate. */
    updates.comments = updates.comments.map((comment) =>
      comment.createDate ? comment : { ...comment, createDate: timestamp }
    );

    /*
    If there are changes to a comment or a comment is deleted
    and the current user is not the author of the blog entry 
    or the comment 
    forbid the action.
    */
    if (
      !canUserMakeRequestedCommentUpdates(req.userid, blogToUpdate, updates)
    ) {
      const err = new Error(
        `There are changes to a comment and the current user (${
          req.userid
        }) is not the author of the blog entry (${blogToUpdate.user.toString()}) or the author of the comment.`
      );
      err.name = 'Forbidden';
      throw err;
    }

    const updatedBlog = await Blog.findOneAndUpdate(
      { _id: req.params.id },
      updates,
      { new: true, runValidators: true }
    )
      .populate('user')
      .populate('comments.user');
    if (updatedBlog) {
      res.json(updatedBlog.toJSON());
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
