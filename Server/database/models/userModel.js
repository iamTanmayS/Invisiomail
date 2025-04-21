const mongoose = require('mongoose');
const Schema = mongoose.Schema


const UserSchema = new Schema({
  googleId: {
    type: String,
    required: true,
    unique: true // Ensures no duplicate Google accounts
  },
  email: {
    type: String,
    required: true,
    unique: true, // Prevents multiple accounts with the same email
    lowercase: true,
    trim: true
  },
  userName: {
    type: String,
    required: true
  },
  picture: {
    type: String,
    default: '' // Optional: profile picture URL
  },
  accessToken:{
    type:String,
    select : false,
  },
  refreshToken:{
    type:String,
    select:false,
  },
  googleAccessToken:{
    type:String,
  },    // Google's access token for Gmail API
  googleRefreshToken: {
    type:String, 
  },
},

{
  timestamps: true
});


const User = mongoose.model('User', UserSchema);

module.exports = User;