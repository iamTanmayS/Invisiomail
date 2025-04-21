const jwt = require('jsonwebtoken');
const config = require('../configs/configenv');

const verifyToken = (req, res, next) => {

  const authHeader = req.headers['authorization'];
  const bearerToken = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;


  const cookieToken = req.cookies?.accessToken;

  const token = cookieToken;
 
  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.accessTokenSecret);
    console.log(decoded)
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = verifyToken;

