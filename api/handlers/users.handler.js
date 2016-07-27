'use strict';

const Boom = require('boom');

exports.findAll = function (request, reply) {
    let sqlQuery = 'SELECT id,username FROM users';

    const qParams = [];

    if (request.query.username) {
        sqlQuery += ' WHERE username = ?';
        qParams.push(request.query.username);
    }
    this.db.all(sqlQuery, qParams, (err, results) => {
        if (err) throw err;
        reply(results);
    });
};

exports.find = function (request, reply) {
    this.db.get('SELECT id, username FROM users WHERE username = ?', [request.params.username],
        (err, result) => {
            if (err) throw err;
            if (typeof result !== 'undefined') {
                reply(result);
            }
            else {
                reply(Boom.notFound(`User with Username=${request.params.username} not found.`));
            }
        }
    );
};
exports.me = function (request, reply) {
    //if (!request.auth.isAuthenticated) {
    //    reply(Boom.unauthorized('You have to login first'))
    //}
    reply(request.auth.credentials);
}