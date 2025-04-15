const jwt = require('jsonwebtoken');
const User = require("../database/models/userModel")
const config = require('../configs/configenv');

const refreshAccessToken = async (req, res) => {
  try {
    // === 1. Determine client type and retrieve refresh token ===
    const isMobile = req.headers['x-client-type'] === 'mobile';
    const refreshToken = isMobile
      ? req.headers.authorization?.split(' ')[1] // Authorization: Bearer <token>
      : req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token missing' });
    }

    // === 2. Verify refresh token ===
    let decoded;
    try {
      decoded = jwt.verify(refreshToken,config.jwt.refreshTokenSecret);
    } catch (err) {
      return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }

    // === 3. Find user and validate stored token ===
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Refresh token mismatch or user not found' });
    }

    // === 4. Generate new tokens ===
    const payload = {
      id: user._id,
      email: user.email,
      userName: user.userName,
    };

    const newAccessToken = jwt.sign(payload, config.jwt.accessTokenSecret, {
      expiresIn: '1h',
    });

    const newRefreshToken = jwt.sign(payload, config.jwt.refreshTokenSecret, {
      expiresIn: '30d',
    });

    // === 5. Store new refresh token in DB ===
    user.refreshToken = newRefreshToken;
    await user.save();

    // === 6. Respond ===
    if (isMobile) {
      // For mobile: send tokens in JSON
      return res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } else {
      // For web: send tokens in cookies
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 15 * 60 * 1000,
      });

      return res.status(204).send();
    }
  } catch (err) {
    console.error('refreshAccessToken error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = refreshAccessToken;
