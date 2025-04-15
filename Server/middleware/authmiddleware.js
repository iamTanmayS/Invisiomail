// middleware/auth.js
const jwt = require('jsonwebtoken');
const config = require('../configs/configenv');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access Denied' });
  try {
    const verified = jwt.verify(token, config.jwt.secret);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid Token' });
  }
};

module.exports = verifyToken;
