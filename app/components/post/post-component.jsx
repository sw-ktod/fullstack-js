'use strict';
import PostForm from "./post-form";
import PostList from "./post-list";
import React from "react";

export default class PostComponent extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            posts: [],
            comments: []
        };
        this.handlePostSubmit = this.handlePostSubmit.bind(this);
        this.handlePostUpdate = this.handlePostUpdate.bind(this);
        this.handlePostDelete = this.handlePostDelete.bind(this);
        this.getUserRelatedPosts = this.getUserRelatedPosts.bind(this);
        this.populate = this.populate.bind(this);
    }

    render() {
        return (
            <div>
                <PostForm onPostSubmit={this.handlePostSubmit}/>
                <br />
                <PostList posts={this.state.posts}
                          comments={this.state.comments}
                          handlePostUpdate={this.handlePostUpdate}
                          handlePostDelete={this.handlePostDelete}/>
            </div>)
    }

    getUserRelatedPosts(username) {
        this.context.postServices.getUserRelatedPosts(username)
            .then((response)=> {
                let dataArray = response.posts.sort((aPost, bPost)=> {
                    return Date.parse(aPost.date_created) < Date.parse(bPost.date_created);
                });
                this.setState({posts: dataArray})
            }, (err)=> {
                this.context.responseHandler.error(err);
            });
        this.context.commentServices.getComments()
            .then((response)=> {
                this.setState({comments: response.comments});
            }, (err)=> {
                this.context.responseHandler.error(err);
            });
    }

    handlePostSubmit(post) {
        let currentUser = this.context.authServices.getStoredData('user').account;
        let receiverUsername = this.props.username;
        if (receiverUsername && receiverUsername !== currentUser.username) {
            post.receiverUsername = receiverUsername;
        }
        this.context.postServices.submitPost(post)
            .then((response) => {
                let postArray = this.state.posts;
                postArray.push(response.post);
                postArray = postArray.sort((aPost, bPost)=> {
                    return Date.parse(aPost.date_created) < Date.parse(bPost.date_created);
                });
                this.setState({posts: postArray})
            }, (err)=> {
                this.context.responseHandler.error(err);
            });
    }

    handlePostUpdate(post) {
        this.context.postServices.editPost(post)
            .then((response)=> {
                let postArray = this.state.posts;
                postArray.forEach((post)=> {
                    if (post.id === response.post.id) {
                        postArray[postArray.indexOf(post)].text = response.post.text;
                        return;
                    }
                });
                this.setState({posts: postArray});
                this.context.responseHandler.success(response.message);
            }, (err)=> {
                this.context.responseHandler.error(err);
            })
    }


    handlePostDelete(postId) {
        this.context.responseHandler.warning('All post related comments will be removed as well.',
            (confirmed) => {
                if (confirmed) {
                    this.context.postServices.removePost(postId)
                        .then((response)=> {
                            let postArray = this.state.posts.filter((post)=> {
                                return post.id !== postId;
                            });
                            let commentArray = this.state.comments.filter((comment)=> {
                                return comment.postId !== postId;
                            });
                            this.setState({posts: postArray, comments: commentArray});
                            this.context.responseHandler.success(response.message)
                        }, (err)=> {
                            this.context.responseHandler.error(err);
                        })
                }
            })
    }

    populate() {
        if (this.context.authServices.isAuthenticated()) {
            if (this.props.username) {
                this.getUserRelatedPosts(this.props.username);
            } else {
                this.context.postServices.getPosts()
                    .then((response)=> {
                        let dataArray = response.posts.sort((aPost, bPost)=> {
                            return Date.parse(aPost.date_created) < Date.parse(bPost.date_created);
                        });
                        this.setState({posts: dataArray})
                    }, (err)=> {
                        this.context.responseHandler.error(err);
                    });
                this.context.commentServices.getComments()
                    .then((response)=> {
                        this.setState({comments: response.comments})
                    }, (err)=> {
                        this.context.responseHandler.error(err);
                    });
            }
        } else {
            this.context.router.push({pathname: '/auth'});
        }
    }

    componentDidMount() {
        this.populate();
    }

    componentWillReceiveProps() {
        this.populate();
    }
}
PostComponent.propTypes = {
    username: React.PropTypes.string
};
PostComponent.contextTypes = {
    authServices: React.PropTypes.object,
    postServices: React.PropTypes.object,
    commentServices: React.PropTypes.object,
    router: React.PropTypes.object,
    responseHandler: React.PropTypes.object
};

