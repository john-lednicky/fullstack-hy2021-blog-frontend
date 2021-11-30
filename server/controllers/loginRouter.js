const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const loginRouter = require('express').Router();
const User = require('../models/userModel');

loginRouter.post('/', async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(401).json({ error: 'invalid username or password' });
  } else {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).json({ error: 'invalid username or password' });
    } else {
      const passwordVerified = await bcrypt.compare(req.body.password, user.passwordHash);
      if (passwordVerified) {
        const tokenUser = {
          username: user.username,
          userid: user.id,
        };
        const token = jwt.sign(tokenUser, process.env.JWT_SIGNATURE);
        res.status(200).send({
          token,
          username: user.username,
          name: user.name,
          id: user.id.toString(),
        });
      } else {
        return res.status(401).json({ error: 'invalid username or password' });
      }
    }
  }
});

module.exports = loginRouter;
