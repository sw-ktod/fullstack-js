'use strict';

const Boom = require('boom');

exports.findAll = function (request, reply) {
    let sqlQuery = 'SELECT id, text, authorUsername, receiverUsername, date_created FROM posts';

    const qParams = [];

    if (request.query.author) {
        sqlQuery += ' WHERE authorUsername = ?';
        qParams.push(request.query.author);
    }
    this.db.all(sqlQuery, qParams, (err, results) => {
        if (err) throw err;
        reply(results);
    });
};
exports.findRelatedPostsByUsername = function (request, reply) {
    this.db.all('SELECT id, text, authorUsername, receiverUsername, date_created FROM posts WHERE authorUsername = ? OR receiverUsername = ?',
        [request.params.username, request.params.username],
        (err, result)=>{
            if(err) throw err;
            if (typeof result !== 'undefined') {
                reply(result);
            }
            else {
                reply(Boom.notFound(`Post with Id=${request.params.postId} not found.`));
            }
        }
    )
};
exports.findRelatedPostsByUserId = function (request, reply) {
    this.db.all('SELECT id, text, authorUsername, receiverUsername, date_created FROM posts WHERE authorId = ? OR receiverId = ?',
        [request.params.id, request.params.id],
        (err, result)=>{
            if(err) throw err;
            if (typeof result !== 'undefined') {
                reply(result);
            }
            else {
                reply(Boom.notFound(`Post with Id=${request.params.postId} not found.`));
            }
        }
    )
};

exports.find = function (request, reply) {
    this.db.get('SELECT id, text, authorUsername, receiverUsername, date_created FROM posts WHERE id = ?', [request.params.postId],
        (err, result) => {
            if (err) throw err;
            if (typeof result !== 'undefined') {
                reply(result);
            }
            else {
                reply(Boom.notFound(`Post with Id=${request.params.postId} not found.`));
            }
        }
    );
};

exports.create = function (request, reply) {
    let post = request.payload;
    post.date_created = Date();
    let receiver = request.params.username;
    if(receiver === request.auth.credentials.username){
        receiver = null;
    }

    this.db.run(`INSERT INTO posts (text, authorUsername, receiverUsername, date_created) VALUES (?, ?, ?, ?);`,
        [post.text, request.auth.credentials.username, receiver, post.date_created],
        function (err) {
            if (err) throw err;
            post.id = this.lastID;
            post.authorUsername = request.auth.credentials.username;
            post.receiverUsername = receiver;
            const uri = request.raw.req.url + '/' + post.id;
            console.log('Created: ', uri);
            reply(post).created(uri);
        });
};

//exports.remove = function (request, reply) {
//    this.db.run('DELETE FROM posts WHERE id = ?', [request.params.postId],
//        function(err) {
//            if(err) throw err;
//            if (this.changes  > 0) {
//                console.log('Deleted: ', request.raw.req.url);
//                reply(`User ${request.params.postId} was deleted successfully.`);
//            } else {
//                reply(Boom.notFound(`User with Id=${request.params.postId} not found.`));
//            }
//        });
//};