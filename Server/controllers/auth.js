// authController.js
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../configs/configenv');
const User = require('../database/models/userModel');

class AuthController {
    static googleLogin(req, res) {
        // Define Gmail and profile scopes
        const scopes = [
          'https://www.googleapis.com/auth/gmail.readonly',
          'https://www.googleapis.com/auth/gmail.modify',
          'https://www.googleapis.com/auth/gmail.compose',
          'https://www.googleapis.com/auth/gmail.send',
          'https://mail.google.com/',
          'profile', 
          'email' 
        ];
    
        
        passport.authenticate('google', { 
          scope: scopes,
          session: false 
        })(req, res);
      }

      static async googleAuthCallback(req, res) {
        passport.authenticate('google', { session: false }, async (err, user, info) => {
          try {
            if (err || !user) {
              console.error('Authentication error:', err || 'No user found');
              return res.redirect(`${config.client.devUrl}/login?error=true`);
            }
      
           
            const payload = {
              id: user._id,
              googleId : user.googleId,
              email: user.email,
              userName: user.userName
            };
      
            // Generate tokens
            const accessToken = jwt.sign(payload, config.jwt.accessTokenSecret, {
              expiresIn: '15m',
            });
            const refreshToken = jwt.sign(payload, config.jwt.refreshTokenSecret, {
              expiresIn: '30d',
            });
      
          
            const updateuser = await User.findOne({ _id: user._id });
            if (updateuser) {
              updateuser.refreshToken = refreshToken;
              await updateuser.save();
            }
      
            
            const isMobile = req.headers['x-client-type'] === 'mobile';
      
            if (isMobile) {
              
              return res.status(200).json({ accessToken, refreshToken });
            } else {
              
              res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
                maxAge: 30 * 24 * 60 * 60 * 1000,
              });
      
              res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
                maxAge: 15 * 60 * 1000,
              });
      
              return res.redirect(`${config.client.devUrl}`);
            }
          } catch (error) {
            console.error('Error in googleAuthCallback:', error);
            return res.status(500).json({ message: 'Internal server error' });
          }
        })(req, res);
      }
}

module.exports = AuthController;