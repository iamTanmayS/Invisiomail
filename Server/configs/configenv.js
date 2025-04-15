require('dotenv').config()

const getEnv = (envfile) =>
{      try{
           return process.env[envfile]
        }
       catch(e){
        log.error(e)
       }
}


const config = {
 port:{
   development:getEnv("PORT_DEV")
 },
 google:{
    clientID:getEnv("GOOGLE_CLIENT_ID"),
    clientSecret:getEnv("GOOGLE_CLIENT_SECRET"),
    callbackURL:getEnv("GOOGLE_CALLBACK_URL")
  },
 client:{
  devUrl: getEnv("CLIENT_DEV_URL")
 },
 jwt:{
  accessTokenSecret:getEnv("JWT_ACCESSTOKEN_SECRET"),
  refreshTokenSecret: getEnv("JWT_REFRESHTOKEN_SECRET"),
  expiry:getEnv("JWT_EXPIRY")
 },
 
 }


module.exports = config