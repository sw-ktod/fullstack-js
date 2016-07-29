'use strict';

const fs = require('fs');
const path = require('path');
const Hapi = require('hapi');
const HapiAuthCookie = require('hapi-auth-cookie');
const Good = require('good');
const Boom = require('boom');
const Sqlite3 = require('sqlite3');
const routes = require('./routes');

// Initialize DBs
const DB_FILE = path.join(__dirname, 'ApiDb.sqlite');
const db = new Sqlite3.Database(DB_FILE, (err) => {
    //Test if comments table exists - if not create it
    if (err) throw err;
    db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name=?;`, ['users'],
        (err, result) => {
            console.log(result);
            if (err) throw err;
            if (!result) {
                db.run(`CREATE TABLE users (
                     id INTEGER PRIMARY KEY,
                     username VARCHAR(50) UNIQUE NOT NULL,
                     password VARCHAR(50) NOT NULL,
                     email VARCHAR(300),
                     firstName VARCHAR(50),
                     lastName VARCHAR(50),
                     dateOfBirth DATETIME
                     );`,
                    function (err) {
                        if (err) throw err;
                        console.log(`Table "users" successfully created in db: ${DB_FILE}`);
                    });
            }
        });
    db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name=?;`, ['posts'],
        (err, result) => {
            console.log(result);
            if (err) throw err;
            if (!result) {
                db.run(`CREATE TABLE posts (
                    id INTEGER PRIMARY KEY,
                    text TEXT NOT NULL,
                    authorUsername VARCHAR(50) NOT NULL,
                    receiverUsername VARCHAR(50),
                    date_created DATETIME NOT NULL
                );`,
                    function (err) {
                        if (err) throw err;
                        console.log(`Table "users" successfully created in db: ${DB_FILE}`);
                    });
            }
        });
    db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name=?;`, ['comments'],
        (err, result) => {
            console.log(result);
            if (err) throw err;
            if (!result) {
                db.run(`CREATE TABLE comments (
                    id INTEGER PRIMARY KEY,
                    text TEXT NOT NULL, authorUsername TEXT NOT NULL,
                    postId INTEGER NOT NULL,
                    date_created DATETIME NOT NULL
                );`,
                    function (err) {
                        if (err) throw err;
                        console.log(`Table "comments" successfully created in db: ${DB_FILE}`);
                    });
            }
        });
});

// Create Hapi server
const server = new Hapi.Server();
server.connection({port: 9000});

server.bind({db: db});

// Registering the Good plugin
server.register([{
    register: Good,
    options: {
        reporters: {
            console: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{
                    error: '*',
                    log: '*'
                }]
            }, {
                module: 'good-console'
            }, 'stdout']
        }
    }
}, {
    register: HapiAuthCookie
}], (err) => {
    if (err) {
        throw err;
    }

    const cache = server.cache({segment: 'sessions', expiresIn: 3 * 24 * 60 * 60 * 1000});
    server.app.cache = cache;

    server.auth.strategy('session', 'cookie', true, {
        password: 'password-should-be-32-characters',
        cookie: '__sess',
        redirectTo: false,
        isSecure: false,
        validateFunc: (request, session, callback) => {
            cache.get(session.__sess, (err, cached) => {

                if (err) {
                    return callback(err, false);
                }

                if (!cached) {
                    return callback(null, false);
                }
                return callback(null, true, cached.account);
            });
        }
    });

    // Registering roots
    server.route(routes);

    // Starting the server
    server.start((err) => {
        if (err) {
            throw err;
        }
        console.log('Server running at:', server.info.uri);
    });
});


