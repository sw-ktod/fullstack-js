'use strict';

const Boom = require('boom');

exports.findAll = function (request, reply) {
    let sqlQuery = 'SELECT id, username, firstName, lastName, email, dateOfBirth FROM users';

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
        function(err, result) {
            if (err) throw err;
            if (typeof result !== 'undefined') {
                return reply(result);
            }
            return reply(Boom.notFound(`User with Username=${request.params.username} not found.`));
        }
    );
};
exports.edit = function (request, reply){
    let username = request.auth.credentials.username;
    let firstName = request.payload.firstName.trim();
    let lastName = request.payload.lastName.trim();
    let email = request.payload.email.trim();
    let dateOfBirth = request.payload.dateOfBirth;

    this.db.run('UPDATE users SET firstName = ?, lastName = ?, email = ?, dateOfBirth = ? WHERE username = ?',
        [firstName, lastName, email, dateOfBirth, username],
        function(err){
            if(err) throw err;
            if(this.changes > 0){
                console.log('Updated: ', request.raw.req.url);
                return reply({username: username, firstName: firstName, lastName: lastName, email: email, dateOfBirth: dateOfBirth});
            }else{
                return reply(Boom.badRequest(`An error occurred. User ${username} was not updated.`));
            }
    })
};
exports.me = function (request, reply) {
    return reply(request.auth.credentials);
};