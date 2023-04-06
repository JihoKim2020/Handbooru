const expressSession = require('express-session');
const mongoDbStore = require('connect-mongodb-session')(expressSession);
require('dotenv').config({path:'.env'});

function createSessionStore() {
    return new mongoDbStore({
        uri: process.env.DATABASE_URI,
        databaseName: 'HandBooru',
        collection: 'sessions',
    });
}

function createSessionConfig() {
    return {
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: createSessionStore(),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
            httpOnly: true,
            secure: false,
        },
    };
}

module.exports = createSessionConfig;

