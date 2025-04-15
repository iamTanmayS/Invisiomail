const User = require("../database/models/userModel")

const logout = async (req, res) => {
    try {
      const isMobile = req.headers['x-client-type'] === 'mobile';
      const refreshToken = isMobile
        ? req.headers.authorization?.split(' ')[1]
        : req.cookies.refreshToken;
  
      if (!refreshToken) return res.sendStatus(204);
  
      const user = await User.findOne({ refreshToken });
      if (user) {
        user.refreshToken = null;
        user.accessToken  = null;
        await user.save();
      }
  
      if (!isMobile) {
        res.clearCookie('refreshToken', {
          httpOnly: true,
          secure: false,
          sameSite: 'Strict',
        });
  
        res.clearCookie('accessToken', {
          httpOnly: true,
          secure: false,
          sameSite: 'Strict',
        });
      }
  
      return res.status(204).send();
    } catch (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }
  };

  module.exports = logout