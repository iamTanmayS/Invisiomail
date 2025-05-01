const jwt = require('jsonwebtoken');
const User = require('../database/models/userModel'); // Import your user model
const config = require('../configs/configenv');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const bearerToken = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  const cookieToken = req.cookies?.accessToken;
  const token = cookieToken || bearerToken;

  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.accessTokenSecret);

    const user = await User.findById(decoded.id); // Safe: exclude password

    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    req.user = user; 
    next();
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = verifyToken;
