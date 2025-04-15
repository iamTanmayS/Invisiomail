// passport-config.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('../configenv');
const User = require('../../database/models/userModel');
const mongoose = require('mongoose');

const configurePassport = () => {
  passport.use(new GoogleStrategy({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackURL,
    accessType: 'offline',
    prompt: 'consent'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        user = new User({
          googleId: profile.id,
          email: profile.emails[0].value,
          userName: profile.displayName,
          picture: profile.photos[0].value,
          accessToken: accessToken,
          refreshToken: refreshToken || null
        });
      } else {
        user.accessToken = accessToken;
        if (refreshToken) user.refreshToken = refreshToken;
       
      }
      await user.save();
      console.log(
        user
      )
      return done(null, user);
    } catch (err) {
      console.error('Error in Google Strategy:', err);
      return done(err, null);
    }
  }));
};

module.exports = configurePassport;
