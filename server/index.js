#!/usr/bin/env node
const app = require('./app');
const { info, error } = require('./utils/logger');
const { PORT } = require('./utils/config');

try {
  if (!PORT) {
    throw Error('PORT environment variable is not defined.');
  }

  app.listen(PORT);
  info(`Server listening on port ${PORT}`);
} catch (err) {
  error(err);
}
