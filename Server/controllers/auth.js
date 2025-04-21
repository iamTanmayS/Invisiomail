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
              googleId: user.googleId,
              email: user.email,
              userName: user.displayName
            };
      
            // JWTs for your app's auth
            const jwtAccessToken = jwt.sign(payload, config.jwt.accessTokenSecret, {
              expiresIn: '1h',
            });
            const jwtRefreshToken = jwt.sign(payload, config.jwt.refreshTokenSecret, {
              expiresIn: '30d',
            });
      
            const updateuser = await User.findById(user._id);
            if (updateuser) {
              updateuser.accessToken = jwtAccessToken;
              updateuser.refreshToken = jwtRefreshToken;
              updateuser.googleAccessToken = user.googleAccessToken;
              updateuser.googleRefreshToken = user.googleRefreshToken;
              await updateuser.save();
            }
      
            const isMobile = req.headers['x-client-type'] === 'mobile';
      
            if (isMobile) {
              // Send all tokens to client (mobile app can store them securely)
              return res.status(200).json({
                accessToken: jwtAccessToken,
                refreshToken: jwtRefreshToken,
                googleAccessToken: user.googleAccessToken,
                googleRefreshToken: user.googleRefreshToken
              });
            } else {
              // Set all tokens in secure cookies
              const isProd = process.env.NODE_ENV === 'production';
      
              res.cookie('accessToken', jwtAccessToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'Lax',
                maxAge: 60 * 60 * 1000
              });
      
              res.cookie('refreshToken', jwtRefreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'Lax',
                maxAge: 30 * 24 * 60 * 60 * 1000
              });
      
              res.cookie('googleAccessToken', user.googleAccessToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'Lax',
                maxAge: 60 * 60 * 1000 // 1 hour — Gmail token expires quickly
              });
      
              res.cookie('googleRefreshToken', user.googleRefreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'Lax',
                maxAge: 30 * 24 * 60 * 60 * 1000 // Google's refresh token is long-lived
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