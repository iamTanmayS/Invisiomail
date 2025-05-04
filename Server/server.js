const express = require("express")
const cors = require("cors")
const config = require("../Server/configs/configenv")
const connectMongodb = require("../Server/database/connection/connection")
const passport = require('passport')
const bodyParser = require('body-parser');
const configurePassport = require('./configs/passport/passport')
const authRoutes = require('./routes/auth')
const emailRoutes = require("./routes/emailroutes")
const userRoutes = require("./routes/userroutes")
const TrackandUpdateRoute = require("./routes/TrackandUpdateroutes")
const DashboardRoute = require("./routes/Dashboardroutes")
const AiGenerationRouter = require("./routes/EmailGenerationRoute")
const cookieParser = require("cookie-parser")
const app = express()






app.use(cors({
    origin:config.client.devUrl,
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}))





app.use(express.json())
app.use(cookieParser());
app.use(bodyParser.json());



// Initialize passport
configurePassport()
app.use(passport.initialize())




// Mount auth routes
app.use('/auth', authRoutes)
app.use("/",emailRoutes)
app.use("/",userRoutes)
app.use("/", TrackandUpdateRoute)
app.use("/", DashboardRoute)
app.use('/',AiGenerationRouter)




const startServer = async () => {
  try {
    await connectMongodb();

    const env = process.env.NODE_ENV || 'development';
    const PORT = process.env.PORT || config.port[env] || 8000;

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running in ${env} mode on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();