'use strict';

const Boom = require('boom');
const md5 = require('md5');
const initialRole = 0;
let uuid = 1;

exports.login = function (request, reply) {
    if (request.auth.isAuthenticated) {
        return reply(Boom.unauthorized(`Already logged in`));
    }
    let user = request.payload;
    if (!user.username || !user.password) {
        reply(Boom.badRequest(`Missing username or password`));
    }
    this.db.get('SELECT id, username,firstName, lastName, email, dateOfBirth, role FROM users WHERE (username = ? AND password = ?)',
        [user.username.trim(), md5(user.password.trim())],
        function (err, result) {
            if (err) throw err;
            if (typeof result !== 'undefined') {
                const sessionId = String(++uuid);
                request.server.app.cache.set(sessionId, {account: result}, 0, function (err) {
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
    let username = request.payload.username.trim();
    let password = request.payload.password.trim();
    let confirmPassword = request.payload.confirmPassword.trim();
    if (!username || !password || !confirmPassword) {
        return reply(Boom.badRequest('Invalid user data'));
    }
    if (password !== confirmPassword) {
        return reply(Boom.badRequest('Passwords don`t match'));
    }

    this.db.get('SELECT id FROM users WHERE username = ?', [username],
        (err, result)=> {
            if (err) throw err;
            if (result !== undefined) {
                return reply(Boom.badRequest('Username alredy exists'));
            }
            this.db.run(`INSERT INTO users (username, password, role) VALUES (?, ?, ?);`,
                [username, md5(password), initialRole],
                function (err) {
                    if (err) throw err;
                    let user = {
                        id: this.lastID,
                        username: username,
                    };
                    const uri = request.raw.req.url + '/' + user.id;
                    console.log('Created: ', uri);
                    return reply(user).created(uri);
                });
        });
};

exports.changePassword = function (request, reply) {
    if (!request.auth.isAuthenticated) {
        return reply(Boom.unauthorized(`Invalid or missing cookie`));
    }
    let password = request.payload.password.trim();
    let newPassword = request.payload.newPassword.trim();
    let confirmPassword = request.payload.confirmPassword.trim();

    if (!password || !confirmPassword || !newPassword) {
        return reply(Boom.badRequest('Invalid user data'));
    }
    if (newPassword !== confirmPassword) {
        return reply(Boom.badRequest('Passwords don`t match'));
    }
    if (password === newPassword) {
        return reply(Boom.badRequest('Your new password can not be the same as the old one'));
    }

    this.db.run('UPDATE users SET password = ? WHERE id = ? AND password = ?',
        [md5(newPassword), request.auth.credentials.id, md5(password)],
        function (err) {
            if (err) throw err;
            const uri = request.raw.req.url + '/' + request.auth.credentials.id;
            console.log('Updated: ', uri);
            if (this.changes > 0) {
                return reply('Successfully changed password');
            }
            return reply(Boom.badRequest('Invalid password'));
        }
    )
};

exports.logout = function (request, reply) {
    request.server.app.cache.drop(request.auth.artifacts.__sess);
    return reply("Successfully logged out");
};
exports.validateAuthentication = function (request, reply) {
    if (!request.auth.isAuthenticated) {
        request.cookieAuth.clear();
        return reply(Boom.unauthorized('Invalid or missing cookie'));
    }
    return reply({account: request.auth.credentials});
};
