const config = require("../configs/configenv")
const jwt = require("jsonwebtoken");
const User = require("../database/models/userModel")

const logout = async (req, res) => {
    try {
      const isMobile = req.headers['x-client-type'] === 'mobile';
      const refreshToken = isMobile
        ? req.headers.authorization?.split(' ')[1]
        : req.cookies.refreshToken;
      console.log(`this is logout token ${refreshToken}`)
      if (!refreshToken) return res.sendStatus(204);
      const decode = jwt.verify(refreshToken,config.jwt.refreshTokenSecret) 
      const googleId = decode.googleId;
      const user = await User.findOne({ googleId });
      console.log(user)
      if (user) {
        user.refreshToken = null;
        user.accessToken  = null;
        user.googleAccessToken = null;
        user.googleRefreshToken = null;
        await user.save();
      }
  
      if (!isMobile) {
        res.clearCookie('refreshToken', {
          httpOnly: true,
          secure: false,
          sameSite: 'Lax',
        });
  
        res.clearCookie('accessToken', {
          httpOnly: true,
          secure: false,
          sameSite: 'Lax',
        });
        res.clearCookie('googleRefreshToken', {
          httpOnly: true,
          secure: false,
          sameSite: 'Lax',
        });
        res.clearCookie('googleAccessToken', {
          httpOnly: true,
          secure: false,
          sameSite: 'Lax',
        });
      }
  
      return res.status(204).send();
    } catch (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }
  };

  module.exports = logout