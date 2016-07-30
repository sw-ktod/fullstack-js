'use strict';

const Joi = require('joi');
const Users = require('./handlers/users.handler');
const Auth = require('./handlers/authentication.handler');
const Posts = require('./handlers/posts.handler');
const Comments = require('./handlers/comments.handler');

module.exports = [
/**
 * AUTH_ROUTES
 */
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
                    username: Joi.string().alphanum().min(5).max(50).required(),
                    password: Joi.string().min(5).max(50).required(),
                    confirmPassword: Joi.string().min(5).max(50).required(),
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
                    username: Joi.string().alphanum().min(5).max(50).required(),
                    password: Joi.string().min(5).max(50).required(),
                })
            },
            auth: {
                mode: 'try',
                strategy: 'session'
            },
        }
    },
    {
        method: 'PUT',
        path: '/api/auth/password',
        config: {
            validate: {
                payload: Joi.object({
                    newPassword: Joi.string().min(5).max(50).required(),
                    confirmPassword: Joi.string().min(5).max(50).required(),
                    password: Joi.string().min(5).max(50).required()
                })
            },
            auth: {
                strategy: 'session'
            }
        },
        handler: Auth.changePassword
    },
    {
        method: 'GET',
        path: '/api/auth/logout',
        config: {
            auth: {
                strategy: 'session'
            },
        },
        handler: Auth.logout
    },
/**
 * End of AUTH_ROUTES
 */

/**
 * USER_ROUTES
 */
    {
        method: 'GET',
        path: '/api/users',
        config: {
            auth: {
                strategy: 'session'
            },
        },
        handler: Users.findAll
    },
    //{
    //    method: 'GET',
    //    path: '/api/me',
    //    config: {
    //        auth: {
    //            strategy: 'session'
    //        },
    //    },
    //    handler: Users.me
    //},
    {
        method: 'GET',
        path: '/api/users/{username}',
        handler: Users.findByUsername,
        config: {
            validate: {
                params: {
                    username: Joi.string().alphanum().min(5).max(50).required()
                }
            },
            auth: {
                strategy: 'session'
            },
        }
    },
    {
        method: 'PUT',
        path: '/api/users/{username}',
        handler: Users.edit,
        config: {
            validate: {
                params: {
                    username: Joi.string().alphanum().min(5).max(50).required()
                },
                payload: {
                    firstName: Joi.string().max(50),
                    lastName: Joi.string().max(50),
                    email: Joi.string().email().max(300),
                    dateOfBirth: Joi.string()
                }
            },
            auth: {
                strategy: 'session'
            },
        }
    },

/**
 * End of USER_ROUTES
 */

/**
 * POST_ROUTES
 */
    {
        method: 'GET',
        path: '/api/posts',
        config: {
            auth: {
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
            auth: {
                strategy: 'session'
            }
        }
    },
    {
        method: 'GET',
        path: '/api/users/{username}/posts',
        handler: Posts.findRelatedPostsByUsername,
        config: {
            validate: {
                params: {
                    username: Joi.string().alphanum().min(5).max(50).required()
                }
            },
            auth: {
                strategy: 'session'
            },
        }
    },
    {
        method: 'POST',
        path: '/api/posts',
        handler: Posts.create,
        config: {
            validate: {
                payload: Joi.object({
                    text: Joi.string().min(2).required(),
                    receiverUsername: Joi.string().alphanum().allow(''),
                })
            },
            auth: {
                strategy: 'session'
            }
        }
    },
    {
        method: 'PUT',
        path: '/api/posts',
        handler: Posts.edit,
        config: {
            validate: {
                //params: {
                //    postId: Joi.number().min(1).required()
                //},
                payload: Joi.object({
                    text: Joi.string().min(2).required(),
                    id: Joi.number().min(1).required(),
                })
            },
            auth: {
                strategy: 'session'
            }
        }
    },
    {
        method: 'DELETE',
        path: '/api/posts/{postId}',
        handler: Posts.remove,
        config: {
            validate: {
                params: {
                    postId: Joi.number().min(1).required()
                }
            },
            auth: {
                strategy: 'session'
            }
        }
    },
/**
 * End of POST_ROUTES
 */

/**
 * COMMENT_ROUTES
 */
    {
        method: 'GET',
        path: '/api/comments',
        handler: Comments.findAll,
        config: {
            auth: {
                strategy: 'session'
            }
        }
    },
    {
        method: 'POST',
        path: '/api/comments',
        handler: Comments.create,
        config: {
            validate: {
                payload: Joi.object({
                    text: Joi.string().min(2).required(),
                    postId: Joi.number().min(1).required(),
                    commentId: Joi.number().min(1),
                })
            },
            auth: {
                strategy: 'session'
            }
        }
    },
    {
        method: 'PUT',
        path: '/api/comments',
        handler: Comments.edit,
        config: {
            validate: {
                payload: Joi.object({
                    text: Joi.string().min(2).required(),
                    id: Joi.number().min(1).required()
                })
            },
            auth: {
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
            auth: {
                strategy: 'session'
            }
        }
    },
/**
 * End of COMMENT_ROUTES
 */

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