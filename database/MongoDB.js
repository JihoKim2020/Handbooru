const mongoose = require('mongoose')
require('dotenv').config({path:'.env'}); // app.js 기준

const uri = process.env.DATABASE_URI;

async function connectDB() {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser:true,
            useUnifiedTopology: true,
            dbName: 'HandBooru',
            serverSelectionTimeoutMS: 10000 // 10 second timeout
        });
        console.log('MongoDB connection successful');
    } catch (err) {
        console.log('MongoDB connection error: ' + err);
    }
}

module.exports = {connectDB};