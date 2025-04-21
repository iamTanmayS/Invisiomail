const fetchUser = require("../controllers/usercontroller")
const express = require("express")
const verifyToken = require("../middleware/authmiddleware")
const userRouter = express.Router()


userRouter.get("/user",verifyToken, fetchUser)

module.exports = userRouter
