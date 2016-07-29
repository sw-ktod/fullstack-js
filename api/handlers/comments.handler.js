'use strict';

const Boom = require('boom');

exports.findAll = function (request, reply) {
    let sqlQuery = 'SELECT id, text, authorUsername, postId, commentId, date_created FROM comments';

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
    this.db.get('SELECT id, text, authorUsername, postId, commentId, date_created FROM comments WHERE postId = ?', [request.params.postId],
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
    this.db.run(`INSERT INTO comments (text, authorUsername, postId, commentId, date_created) VALUES (?, ?, ?, ?, ?);`,
        [comment.text, request.auth.credentials.username, comment.postId, comment.commentId, comment.date_created],
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
exports.edit = function (request, reply) {
    if (request.auth.credentials.role === 'admin') {
        let comment = request.payload;
        this.db.run('UPDATE comments SET text = ? WHERE id = ?',
            [comment.text, comment.id],
            (err)=> {
                if (err) throw err;

                console.log('Updated: ', uri);
                return reply(comment).updated(uri);
            })
    } else {
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
                                    } else {
                                        let comment = request.payload;
                                        this.db.run('UPDATE comments SET text = ? WHERE id = ?',
                                            [comment.text, comment.id],
                                            (err)=> {
                                                if (err) throw err;

                                                console.log('Updated: ', uri);
                                                return reply(comment).updated(uri);
                                            })
                                    }
                                }
                            }
                        )
                    } else {
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
    }
};

exports.remove = function (request, reply) {
    if (request.auth.credentials.role === 'admin') {
        this.db.run('DELETE FROM comments WHERE id = ? OR commentId = ?',
            [request.params.commentId, request.params.commentId],
            (err) => {
                if (err) throw err;
                console.log('Deleted: ', request.raw.req.url);
                return reply(`Comment ${request.params.commentId} was deleted successfully.`);
            }
        );
    } else {
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
                                    } else {
                                        this.db.run('DELETE FROM comments WHERE id = ? OR commentId = ?',
                                            [request.params.commentId, request.params.commentId],
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
                    } else {
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
    }
};