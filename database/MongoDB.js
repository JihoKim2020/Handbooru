require('dotenv').config({path:'.env'}); // app.js 기준

const { MongoClient } = require('mongodb');
const uri = process.env.DATABASE_URI;
const client = new MongoClient(uri, {useNewUrlParser:true});
const userDB = client.db("HandBooru").collection("users")
const imgDB = client.db("HandBooru").collection("images")

async function connectDB() {
    try {
        await client.connect();
        console.log('MongoDB connection successful');
    } catch (err) {
        console.log('MongoDB connection error: ' + err);
    }
}

module.exports = {client, userDB, imgDB, connectDB};