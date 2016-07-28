'use strict';
import PostForm from "./post-form";
import PostList from "./post-list";
import React from "react";
import errorHandler from "../error-handler"

export default class PostComponent extends React.Component{

    constructor(props, context){
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
        return  (
            <div>
            <PostForm onPostSubmit={this.handlePostSubmit}/>
            <br />
                <PostList posts={this.state.posts} comments={this.state.comments}
                          handlePostDelete={this.handlePostDelete}
                          handleCommentSubmit={this.handleCommentSubmit}
                          handleCommentDelete={this.handleCommentDelete}    />
            </div>)
    }
    handlePostSubmit(post){
        this.context.postServices.submitPost(post)
            .then((result) => {
                let postArray = this.state.posts;
                postArray.push(result);
                postArray = postArray.sort((aPost, bPost)=>{
                    return Date.parse(aPost.date_created) < Date.parse(bPost.date_created);
                });
                this.setState({posts: postArray})
            }, (err)=>{
                errorHandler(err.status, err.statusText, this.context.authServices, this.context.router);
        });
    }
    handlePostDelete(postId){
        this.context.postServices.removePost(postId)
            .then(()=>{
                let postArray = this.state.posts.filter((post)=>{
                    return post.id !== postId;
                });
                this.setState({posts:postArray});
            }, (err)=>{
                errorHandler(err.status, err.statusText, this.context.authServices, this.context.router);
            })
    }
    handleCommentSubmit(comment){
        console.log(comment);
        this.context.commentServices.submitComment(comment)
            .then((result) => {
                let commentsArray = this.state.comments;
                commentsArray.push(result);
                this.setState({comments: commentsArray})
            }, (err)=>{
                errorHandler(err.status, err.statusText, this.context.authServices, this.context.router);
        });
    }

    handleCommentDelete(commentId){
        this.context.commentServices.deleteComment(commentId)
            .then(()=>{
                let comments = this.state.comments.filter((comment)=>{
                    return comment.id !== commentId;
                });
                this.setState({comments: comments})
            }, (err)=>{
                errorHandler(err.status, err.statusText, this.context.authServices, this.context.router);
        });
    }
    componentDidMount(){
        if(this.context.authServices.isAuthenticated()){
            this.context.postServices.getPosts()
                .then((result)=>{
                    let dataArray = result.sort((aPost, bPost)=>{
                        return Date.parse(aPost.date_created) < Date.parse(bPost.date_created);
                    });
                    this.setState({posts: dataArray})
                }, (err)=>{
                    errorHandler(err.status, err.statusText, this.context.authServices, this.context.router);
            });
            this.context.commentServices.getComments().then((result)=>{
                this.setState({comments: result})
            }, (err)=>{
                errorHandler(err.status, err.statusText, this.context.authServices, this.context.router);
        });
        }else{
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
};

