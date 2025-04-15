
const express = require("express")
const authRouter = express.Router();
const AuthController = require('../controllers/auth');
const refreshAccessToken = require("../controllers/refreshAccessToken");
const logout = require('../controllers/logout')

authRouter.get("/google/login",AuthController.googleLogin)
authRouter.get('/google/callback',AuthController.googleAuthCallback);
authRouter.get('/refreshToken',refreshAccessToken)
authRouter.post("/logout",logout)





module.exports = authRouter