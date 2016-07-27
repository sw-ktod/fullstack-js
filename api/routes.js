'use strict';

const Joi = require('joi');
const Users = require('./handlers/users.handler');
const Auth = require('./handlers/authentication.handler');
const Posts = require('./handlers/posts.handler');
const Comments = require('./handlers/comments.handler');

module.exports = [

    {
        method: 'GET',
        path: '/api/auth',
        handler: Auth.validateAuthentication,
        config: {
            auth: {
                mode: 'try',
                strategy: 'session'
            },
        }
    },
    {
        method: 'POST',
        path: '/api/auth/register',
        handler: Auth.register,
        config: {
            validate: {
                payload: Joi.object({
                    //id: Joi.number().integer().min(1).optional(),
                    username: Joi.string().min(5).required(),
                    password: Joi.string().min(5).required(),
                })
            },
            auth: {
                mode: 'try',
                strategy: 'session'
            },
        }
    },
    {
        method: 'POST',
        path: '/api/auth/login',
        handler: Auth.login,
        config: {
            validate: {
                payload: Joi.object({
                    //id: Joi.number().integer().min(1).optional(),
                    username: Joi.string().min(5).required(),
                    password: Joi.string().min(5).required(),
                })
            },
            auth: {
                mode: 'try',
                strategy: 'session'
            },
        }
    },
    {
        method: 'GET',
        path: '/api/auth/logout',
        config:{
            auth: {
                strategy: 'session'
            },
        },
        handler: Auth.logout
    },
    {
        method: 'GET',
        path: '/api/users',
        config:{
            auth: {
                strategy: 'session'
            },
        },
        handler: Users.findAll
    },
    {
        method: 'GET',
        path: '/api/users/me',
        config:{
            auth: {
                strategy: 'session'
            },
        },
        handler: Users.me
    },
    {
        method: 'GET',
        path: '/api/users/{username}',
        handler: Users.find,
        config: {
            validate: {
                params: {
                    username: Joi.string().min(5).required()
                }
            },
            auth: {
                strategy: 'session'
            },
        }
    },
    {
        method: 'GET',
        path: '/api/users/{username}/posts',
        handler: Posts.findRelatedPostsByUsername,
        config: {
            validate: {
                params: {
                    username: Joi.string().min(5).required()
                }
            },
            auth: {
                strategy: 'session'
            },
        }
    },
    {
        method: 'POST',
        path: '/api/users/{username}/posts',
        handler: Posts.create,
        config: {
            validate: {
                params: {
                    username: Joi.string().min(5).required(),
                }
            },
            auth: {
                strategy: 'session'
            },
        }
    },

    {
        method: 'GET',
        path: '/api/posts',
        config:{
            auth:{
                strategy: 'session'
            }
        },
        handler: Posts.findAll,
    },
    {
        method: 'GET',
        path: '/api/posts/{postId}',
        handler: Posts.find,
        config: {
            validate: {
                params: {
                    postId: Joi.number().integer().min(1).required()
                }
            },
            auth:{
                strategy: 'session'
            }
        }
    },
    {
        method: 'Post',
        path: '/api/posts',
        handler: Posts.create,
        config: {
            validate: {
                payload: Joi.object({
                    text: Joi.string().min(3).required(),
                })
            },
            auth:{
                strategy: 'session'
            }
        }
    },
    {
        method: 'GET',
        path: '/api/posts/{postId}/comments',
        handler: Comments.find,
        config: {
            validate: {
                params: {
                    postId: Joi.number().integer().min(1).required()
                }
            },
            auth:{
                strategy: 'session'
            }
        }
    },
    {
        method: 'GET',
        path: '/api/comments',
        handler: Comments.findAll,
        config: {
            auth:{
                strategy: 'session'
            }
        }
    },
    {
        method: 'POST',
        path: '/api/posts/{postId}/comments',
        handler: Comments.create,
        config: {
            validate: {
                payload: Joi.object({
                    text: Joi.string().min(1).required(),
                    postId: Joi.number().min(1).required()
                })
            },
            auth:{
                strategy: 'session'
            }
        }
    },
    {
        method: 'DELETE',
        path: '/api/comments/{commentId}',
        handler: Comments.remove,
        config: {
            validate: {
                params: {
                    commentId: Joi.number().min(1).required()
                }
            },
            auth:{
                strategy: 'session'
            }
        }
    },

    //{
    //    method: 'DELETE',
    //    path: '/api/users/{userId}',
    //    handler: Users.remove,
    //    config: {
    //        validate: {
    //            params: {
    //                userId: Joi.number().integer().min(1).required()
    //            }
    //        }
    //    }
    //}
];