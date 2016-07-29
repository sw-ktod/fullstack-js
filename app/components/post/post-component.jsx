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
        this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
        this.handleCommentDelete = this.handleCommentDelete.bind(this);
        this.handlePostDelete = this.handlePostDelete.bind(this);
    }

    render() {
        return (
            <div>
                <PostForm onPostSubmit={this.handlePostSubmit}/>
                <br />
                <PostList posts={this.state.posts} comments={this.state.comments}
                          handlePostDelete={this.handlePostDelete}
                          handleCommentSubmit={this.handleCommentSubmit}
                          handleCommentDelete={this.handleCommentDelete}/>
            </div>)
    }

    handlePostSubmit(post) {
        this.context.postServices.submitPost(post)
            .then((result) => {
                let postArray = this.state.posts;
                postArray.push(result);
                postArray = postArray.sort((aPost, bPost)=> {
                    return Date.parse(aPost.date_created) < Date.parse(bPost.date_created);
                });
                this.setState({posts: postArray})
            }, (err)=> {
                this.context.errorHandler.alertError(err);
            });
    }

    handlePostDelete(postId) {
        this.context.postServices.removePost(postId)
            .then(()=> {
                let postArray = this.state.posts.filter((post)=> {
                    return post.id !== postId;
                });
                this.setState({posts: postArray});
            }, (err)=> {
                this.context.errorHandler.alertError(err);
            })
    }

    handleCommentSubmit(comment) {
        this.context.commentServices.submitComment(comment)
            .then((result) => {
                let commentsArray = this.state.comments;
                commentsArray.push(result);
                this.setState({comments: commentsArray})
            }, (err)=> {
                this.context.errorHandler.alertError(err);
            });
    }

    handleCommentDelete(commentId) {
        this.context.commentServices.deleteComment(commentId)
            .then(()=> {
                let comments = this.state.comments.filter((comment)=> {
                    return comment.id !== commentId;
                });
                this.setState({comments: comments})
            }, (err)=> {
                this.context.errorHandler.alertError(err);
            });
    }

    componentDidMount() {
        if (this.context.authServices.isAuthenticated()) {
            this.context.postServices.getPosts()
                .then((result)=> {
                    let dataArray = result.sort((aPost, bPost)=> {
                        return Date.parse(aPost.date_created) < Date.parse(bPost.date_created);
                    });
                    this.setState({posts: dataArray})
                }, (err)=> {
                    this.context.errorHandler.alertError(err);
                });
            this.context.commentServices.getComments().then((result)=> {
                this.setState({comments: result})
            }, (err)=> {
                this.context.errorHandler.alertError(err);
            });
        } else {
            this.context.router.push({pathname: '/auth'});
        }
    }
}
PostComponent.propTypes = {
    postId: React.PropTypes.number
};
PostComponent.contextTypes = {
    authServices: React.PropTypes.object,
    postServices: React.PropTypes.object,
    commentServices: React.PropTypes.object,
    router: React.PropTypes.object,
    errorHandler: React.PropTypes.object
};

