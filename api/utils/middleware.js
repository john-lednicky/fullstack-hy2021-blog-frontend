const logger = require('./logger');
// const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method);
  logger.info('Path:  ', req.path);
  logger.info('Authorization:  ', req.get('authorization'));
  logger.info('Body:  ', req.body);
  logger.info('---');
  next();
};

const verifyToken = async (req, res, next) => {
  const authHeaderValue = req.get('authorization');
  if (authHeaderValue && authHeaderValue.toLowerCase().startsWith('bearer ')) {
    req.token = authHeaderValue.substring(7);
    const decodedToken = jwt.verify(req.token, process.env.JWT_SIGNATURE);
    if (decodedToken.username && decodedToken.userid && decodedToken.iat) {
      const tokenAgeInMinutes = (Date.now() - (decodedToken.iat * 1000)) / 60000;
      if (tokenAgeInMinutes < 360) {
        req.username = decodedToken.username;
        req.userid = decodedToken.userid;
        next();
      }
      /*
        const fetchedUser = await User.findById(decodedToken.userid);
        if (fetchedUser && fetchedUser.username === decodedToken.username) {
          req.username = fetchedUser.username;
          req.userid = fetchedUser.id;
          next();
        }
      */
    }
  }
  if (!req.username || !req.userid) {
    res.status(401).json({ error: 'invalid or missing bearer token' });
  }
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, req, res, next) => {
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformed id' });
  }

  if (error.name === 'Forbidden') {
    return res.status(403).json({ error: error.message });
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }

  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: error.message });
  }

  logger.error(error.message);

  next(error);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  verifyToken,
};
