
const mongoose = require("mongoose");
const config = require("../../configs/configenv");
 

const connectMongodb = async () => {

    
    try {
        await mongoose.connect(config.mongodb.url);
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        
    }

    mongoose.connection.on('error', err => {
        console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected. Attempting to reconnect...');
        setTimeout(connectMongodb, 5000);
    });
}

module.exports = connectMongodb