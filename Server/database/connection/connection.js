const mongoose = require("mongoose")



const connectMongodb = () => 
    {

                             
    try {
        mongoose.connect(process.env.MONGO_URL)
        console.log("connected to mongodb")
    } catch (error) {
        console.log(error)
    }
    }


module.exports = connectMongodb