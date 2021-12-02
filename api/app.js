const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const { MONGODB_URI } = require('./utils/config');
const { info, error } = require('./utils/logger');
const middleware = require('./utils/middleware');
const mongoose = require('mongoose');
require('express-async-errors');

app.use(express.json());

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      info('connected to MongoDB');
    })
    .catch(err => {
      error('error connecting to MongoDB:', err.message);
    });
}

app.use(cors());

app.use(middleware.requestLogger);

app.use('/api/login', require('./controllers/loginRouter'));
app.use('/api/blogs', require('./controllers/blogRouter'));
app.use('/api/users', require('./controllers/userRouter'));

if (process.env.NODE_ENV !== 'production') {
  app.use('/api/test', require('./controllers/testRouter'));
  app.use('/', express.static(path.join(__dirname, '../dist')));
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
