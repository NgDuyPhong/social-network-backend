const jwt = require('jsonwebtoken');

exports.generateToken = (payload, expeired) => {
  return jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: expeired,
  });
};
