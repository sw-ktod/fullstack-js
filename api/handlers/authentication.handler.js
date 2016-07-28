'use strict';

const Boom = require('boom');
const md5 = require('md5');
let uuid = 1;

exports.login = function (request, reply) {
    if (request.auth.isAuthenticated) {
        return reply(Boom.unauthorized(`Already logged in`));
    }
    let user = request.payload;
    if (!user.username || !user.password) {
        reply(Boom.badRequest(`Missing username or password`));
    }
    this.db.get('SELECT id, username FROM users WHERE (username = ? AND password = ?)',
        [user.username, md5(user.password)],
        (err, result) => {
            if (err) throw err;
            if (typeof result !== 'undefined') {
                const sessionId = String(++uuid);
                request.server.app.cache.set(sessionId, {account: result}, 0, (err) => {
                    if (err) {
                        throw (err);
                    }
                    request.cookieAuth.set({__sess: sessionId});
                    return reply(result);
                });
            }
            else {
                reply(Boom.badRequest(`Invalid username or password`));
            }
        });
};

exports.register = function (request, reply) {
    if (request.auth.isAuthenticated) {
        return reply(Boom.unauthorized(`Already logged in`));
    }
    let user = request.payload;
    console.log(user);
    this.db.run(`INSERT INTO users (username, password) VALUES (?, ?);`,
        [user.username, md5(user.password)],
        (err) => {
            if (err) throw err;
            user.id = this.lastID;
            const uri = request.raw.req.url + '/' + user.id;
            console.log('Created: ', uri);
            reply(user).created(uri);
        });
};
exports.logout = function (request, reply) {
    request.cookieAuth.clear();
    return reply("Successfully logged out");
};
exports.validateAuthentication = function (request, reply) {
    if(!request.auth.isAuthenticated) {
        request.cookieAuth.clear();
        return reply(Boom.unauthorized('Invalid or missing cookie'));
    }
    return reply({account: request.auth.credentials});
}
