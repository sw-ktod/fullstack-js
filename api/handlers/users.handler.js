'use strict';

const Boom = require('boom');

exports.findAll = function (request, reply) {
    let sqlQuery = 'SELECT id, username, firstName, lastName, email, role dateOfBirth FROM users';

    const qParams = [];

    if (request.query.username) {
        sqlQuery += ' WHERE username = ?';
        qParams.push(request.query.username);
    }
    this.db.all(sqlQuery, qParams,
        function (err, results) {
            if (err) throw err;
            return reply(results);
        });
};
exports.findByUsername = function (request, reply) {
    this.db.get('SELECT id, username, firstName, lastName, email, dateOfBirth FROM users WHERE username = ?', [request.params.username],
        function (err, result) {
            if (err) throw err;
            if (typeof result !== 'undefined') {
                return reply(result);
            }
            return reply(Boom.notFound(`User with Username ${request.params.username} not found.`));
        }
    );
};
exports.edit = function (request, reply) {
    let username;
    if (request.payload.username) {
        username = request.payload.username.trim()
    } else {
        username = request.auth.credentials.username;
    }
    let id = request.payload.id;
    let firstName = request.payload.firstName.trim();
    let lastName = request.payload.lastName.trim();
    let email = request.payload.email.trim();
    let dateOfBirth = request.payload.dateOfBirth;

    if (request.auth.credentials.role < 1) {
        if (username !== request.auth.credentials.username) {
            return reply(Boom.unauthorized('Cannot edit account you do not own'))
        }
    }
    this.db.run('UPDATE users SET firstName = ?, lastName = ?, email = ?, dateOfBirth = ? WHERE username = ?',
        [firstName, lastName, email, dateOfBirth, username],
        function (err) {
            if (err) throw err;
            if (this.changes > 0) {
                console.log('Updated: ', request.raw.req.url);

                let user = {
                    id: id,
                    username: username,
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    dateOfBirth: dateOfBirth,
                    role: request.auth.credentials.role
                }
                if(!user.role){
                    delete user.role;
                }
                return reply({status:200, message:"Successfully edited user", user:user});

            } else {
                return reply(Boom.badRequest(`An error occurred. User ${username} was not updated.`));
            }
        })

};
exports.remove = function (request, reply) {
    if (request.auth.credentials.role > 0) {
        this.db.run('UPDATE posts SET receiverUsername = ? WHERE receiverUsername = ?',
            [request.params.username, request.params.username],
            function (err) {
                if (err) throw err;
                if (this.changes > 0) {
                    console.log('Related posts removed: ', request.raw.req.url);
                }
            });
        this.db.run('DELETE FROM comments WHERE authorUsername = ?',
            [request.params.username],
            function (err) {
                if(err) throw err;
                if (this.changes > 0) {
                    console.log('Related comments removed: ', request.raw.req.url);
                }
            });

        this.db.run('DELETE FROM posts WHERE authorUsername = ?',
            [request.params.username],
            function (err) {
                if (err) throw err;
                if (this.changes > 0) {
                    console.log('Own posts removed: ', request.raw.req.url);
                }
            });
        this.db.run('DELETE FROM users WHERE username = ?',
            [request.params.username],
            function (err) {
                if (err) throw err;
                if (this.changes > 0) {
                    console.log(`User ${request.params.username} removed: `, request.raw.req.url);
                }
            });
        return reply({status:200, message:"Successfully removed user"});

    } else {
        return reply(Boom.unauthorized('Users are not allowed to remove accounts'))
    }
};
exports.me = function (request, reply) {
    return reply(request.auth.credentials);
};