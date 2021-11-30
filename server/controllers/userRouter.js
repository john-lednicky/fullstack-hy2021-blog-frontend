const bcrypt = require('bcrypt');
const userRouter = require('express').Router();
const User = require('../models/userModel');
const Blog = require('../models/blogModel');

userRouter.get('/', async (req, res) => {
  const results = await User.find({}).populate('blogs');
  res.json(results).end();
});

userRouter.get('/:username', async (req, res) => {
  const fetchedUser = await User.findOne({ username: req.params.username }).populate('blogs');
  if (fetchedUser) {
    res.json(fetchedUser);
  } else {
    res.status(404).end();
  }
});

userRouter.delete('/:username', async (req, res) => {
  const fetchedUser = await User.findOne({ username: req.params.username });
  if (fetchedUser) {
    const result = await User.findByIdAndRemove(fetchedUser.id);
    if (result) {
      await Blog.deleteMany({ user: fetchedUser.id });
      res.status(204).end();
    } else {
      res.status(404).end();
    }
  } else {
    res.status(404).end();
  }
});

const isValidPassword = password => {
  if (!password) {
    return false;
  } else {
    return password.length && password.length >= 3;
  }
};

userRouter.post('/', async (req, res) => {
  if (isValidPassword(req.body.password)) {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(req.body.password, saltRounds);

    const newUser = new User({
      username: req.body.username,
      name: req.body.name,
      passwordHash,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser).end();
  } else {
    res.status(400).end();
  }
});

userRouter.put('/:username', async (req, res) => {
  const fetchedUser = await User.findOne({ username: req.params.username });
  if (fetchedUser) {
    const updates = {};
    if (req.body.hasOwnProperty('username')) {
      updates.username = req.body.username;
    }

    if (req.body.hasOwnProperty('name')) {
      updates.name = req.body.name;
    }

    if (req.body.hasOwnProperty('password')) {
      if (!isValidPassword(req.body.password)) {
        res.status(400).end();
      }

      const saltRounds = 10;
      updates.passwordHash = await bcrypt.hash(req.body.password, saltRounds);
    }

    const updatedUser = await User.findOneAndUpdate({ _id: fetchedUser.id }, updates, { new: true, runValidators: true });
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).end();
    }
  } else {
    res.status(404).end();
  }
});

module.exports = userRouter;
