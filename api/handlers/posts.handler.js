'use strict';

const Boom = require('boom');

exports.findAll = function (request, reply) {
    let sqlQuery = 'SELECT id, text, authorUsername, receiverUsername, date_created FROM posts';

    const qParams = [];

    if (request.query.author) {
        sqlQuery += ' WHERE authorUsername = ?';
        qParams.push(request.query.author);
    }
    this.db.all(sqlQuery, qParams, function (err, results) {
        if (err) throw err;
        return reply(results);
    });
};
exports.findRelatedPostsByUsername = function (request, reply) {
    this.db.all('SELECT id, text, authorUsername, receiverUsername, date_created ' +
        'FROM posts ' +
        'WHERE authorUsername = ? ' +
        'OR receiverUsername = ? ' +
        'OR id IN (SELECT postId FROM comments WHERE authorUsername = ?)',
        [request.params.username, request.params.username, request.params.username],
        function (err, result) {
            if (err) throw err;
            if (typeof result !== 'undefined') {
                return reply(result);
            }
            else {
                return reply(Boom.notFound(`Post with Id=${request.params.postId} not found.`));
            }
        }
    )
};

exports.find = function (request, reply) {
    this.db.get('SELECT id, text, authorUsername, receiverUsername, date_created FROM posts WHERE id = ?', [request.params.postId],
        function (err, result) {
            if (err) throw err;
            if (typeof result !== 'undefined') {
                return reply(result);
            }
            else {
                return reply(Boom.notFound(`Post with Id=${request.params.postId} not found.`));
            }
        }
    );
};

exports.create = function (request, reply) {
    let post = request.payload;
    post.date_created = Date();
    let postReceiver = post.receiverUsername;
    if (postReceiver === request.auth.credentials.username) {
        postReceiver = '';
    }
    this.db.run(`INSERT INTO posts (text, authorUsername, receiverUsername, date_created) VALUES (?, ?, ?, ?);`,
        [post.text, request.auth.credentials.username, postReceiver, post.date_created],
        function (err) {
            if (err) throw err;
            post.id = this.lastID;
            post.authorUsername = request.auth.credentials.username;
            post.receiverUsername = postReceiver;
            const uri = request.raw.req.url + '/' + post.id;
            console.log('Created: ', uri);
            return reply({status: 201, message: "Successfully created post", post: post}).created(uri);
        });
};
exports.edit = function (request, reply) {
    let post = request.payload;
    if (request.auth.credentials.role > 0) {
        this.db.run('UPDATE posts SET text = ? WHERE id = ?',
            [post.text, post.id],
            function (err) {
                if (err) throw err;
                if (this.changes > 0) {
                    console.log('Updated: ', request.raw.req.url + `/${post.id}`);
                    return reply({status: 200, message: "Successfully edited post", post: post});
                }
                return reply(Boom.notFound(`Post with id: ${post.id} was not found`));
            })
    } else {
        this.db.get('SELECT authorUsername FROM posts WHERE id = ?', [post.id],
            (err, result) => {
                if (err) throw err;
                if (result.authorUsername === request.auth.credentials.username) {
                    this.db.run('UPDATE posts SET text = ? WHERE id = ?',
                        [post.text, post.id],
                        function (err) {
                            if (err) throw err;
                            if (this.changes > 0) {
                                console.log('Updated: ', request.raw.req.url + `/${post.id}`);
                                return reply({status: 200, message: "Successfully edited post", post: post});
                            }
                            return reply(Boom.notFound(`Post with id: ${post.id} was not found`));
                        })
                } else {
                    return reply(Boom.unauthorized('Cannot edit posts you do not own'));
                }
            });
    }
};

exports.remove = function (request, reply) {
    if (request.auth.credentials.role > 0) {
        this.db.run('DELETE FROM comments WHERE postId = ?', [request.params.postId],
            function (err) {
                if (err) throw err;
                if (this.changes > 0) {
                    console.log('Deleted: ', request.raw.req.url);
                }
            });
        this.db.run('DELETE FROM posts WHERE id = ?', [request.params.postId],
            function (err) {
                if (err) throw err;
                if (this.changes > 0) {
                    console.log('Deleted: ', request.raw.req.url);
                    return reply({status: 200, message: "Successfully deleted post"});
                } else {
                    return reply(Boom.notFound(`Post with Id=${request.params.postId} not found.`));
                }
            });
    } else {
        this.db.get('SELECT authorUsername, receiverUsername FROM posts WHERE id = ?', [request.params.postId],
            (err, result)=> {
                if (err) throw err;
                if (result.authorUsername === request.auth.credentials.username) {
                    this.db.run('DELETE FROM comments WHERE postId = ?', [request.params.postId],
                        function (err) {
                            if (err) throw err;
                            if (this.changes > 0) {
                                console.log('Deleted: ', request.raw.req.url, ' comments');
                            }
                        });
                    this.db.run('DELETE FROM posts WHERE id = ?', [request.params.postId],
                        function (err) {
                            if (err) throw err;
                            if (this.changes > 0) {
                                console.log('Deleted: ', request.raw.req.url);
                                return reply({status: 200, message: "Successfully deleted post"});
                            }
                            return reply(Boom.notFound(`Post with Id=${request.params.postId} not found.`));

                        });
                } else {
                    if (result.receiverUsername === request.auth.credentials.username) {
                        this.db.run('UPDATE posts SET receiverUsername = ?', [null],
                            function (err) {
                                if (err) throw err;
                                if (this.changes > 0) {
                                    console.log('Removed link: ', request.raw.req.url);
                                    return reply({status: 200, message: "Successfully deleted post"});
                                }
                                return reply(Boom.notFound(`Post with Id=${request.params.postId} not found.`));
                            });
                    } else {
                        return reply(Boom.forbidden('You can not remove posts you do not own'))
                    }
                }
            });
    }
};