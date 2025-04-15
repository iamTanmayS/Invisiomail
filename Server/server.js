const express = require("express")
const cors = require("cors")
const config = require("../Server/configs/configenv")
const connectMongodb = require("../Server/database/connection/connection")
const passport = require('passport')
const configurePassport = require('./configs/passport/passport')
const authRoutes = require('./routes/auth')
const cookieParser = require("cookie-parser")
const app = express()

app.use(cors({
    origin:config.client.devUrl,
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}))

app.use(express.json())
app.use(cookieParser());
// Initialize passport
configurePassport()
app.use(passport.initialize())

// Mount auth routes
app.use('/auth', authRoutes)

connectMongodb()

app.post("/",(req,res)=>{
    res.send("Hello from server")
})

app.listen(
    config.port.development || 8000 ,()=>{
        console.log("server is running on port 3000")
    }
)
