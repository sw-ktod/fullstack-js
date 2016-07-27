'use strict';

const Boom = require('boom');

exports.findAll = function (request, reply) {
    let sqlQuery = 'SELECT id, text, authorUsername, postId, date_created FROM comments';

    const qParams = [];

    if (request.query.authorId) {
        sqlQuery += ' WHERE authorId = ?';
        qParams.push(request.query.authorId);
    }
    this.db.all(sqlQuery, qParams, (err, results) => {
        if (err) throw err;
        return reply(results);
    });
};

exports.find = function (request, reply) {
    this.db.get('SELECT id, text, authorUsername, postId, date_created FROM comments WHERE postId = ?', [request.params.postId],
        (err, result) => {
            if (err) throw err;
            if (typeof result !== 'undefined') {
                return reply(result);
            }
        }
    );
};

exports.create = function (request, reply) {
    let comment = request.payload;
    comment.date_created = Date();
    this.db.run(`INSERT INTO comments (text, authorUsername, postId, date_created) VALUES (?, ?, ?, ?);`,
        [comment.text, request.auth.credentials.username, comment.postId, comment.date_created],
        function (err) {
            if (err) throw err;
            comment.id = this.lastID;
            comment.authorUsername = request.auth.credentials.username;
            const uri = request.raw.req.url + '/' + comment.id;
            console.log('Created: ', uri);
            return reply(comment).created(uri);
        }
    );
};

exports.remove = function (request, reply) {
    this.db.get('SELECT authorUsername, postId FROM comments WHERE id = ?', [request.params.commentId],
        (err, result) => {
            if (err) throw err;
            if (typeof result !== 'undefined') {
                if (request.auth.credentials.username !== result.authorUsername) {
                    this.db.get('SELECT authorUsername FROM posts WHERE id = ?', [result.postId],
                        (err, postResult) => {
                            if (err) throw err;
                            if (typeof postResult !== 'undefined') {
                                if (request.auth.credentials.username !== postResult.authorUsername) {
                                    return reply(Boom.unauthorized());
                                }else{
                                    console.log(request.params.commentId);
                                    this.db.run('DELETE FROM comments WHERE id = ?', [request.params.commentId],
                                        (err) => {
                                            if (err) throw err;
                                            console.log('Deleted: ', request.raw.req.url);
                                            return reply(`Comment ${request.params.commentId} was deleted successfully.`);
                                        }
                                    );
                                }
                            }
                        }
                    )
                }else{
                    console.log(request.params.commentId);
                    this.db.run('DELETE FROM comments WHERE id = ?', [request.params.commentId],
                        (err) => {
                            if (err) throw err;
                            console.log('Deleted: ', request.raw.req.url);
                            return reply(`Comment ${request.params.commentId} was deleted successfully.`);
                        }
                    );
                }

            }
        });
};