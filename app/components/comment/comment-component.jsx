import React from "react";

import CommentForm from "./comment-form";
import CommentList from "./comment-list";

export default class CommentComponent extends React.Component{
    constructor(props, context){
        super(props, context);
        this.state = {
            comments: [],
        };
        this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
        this.handleCommentDelete = this.handleCommentDelete.bind(this);
        this.handleCommentUpdate = this.handleCommentUpdate.bind(this);
        this.populate = this.populate.bind(this);

    }
    render(){
        return (
            <div>
                <CommentList postId={this.props.postId}
                             postAuthor={this.props.postAuthor}
                             data={this.state.comments}
                             parentCommentId={this.props.parentCommentId}
                             onCommentDelete={this.handleCommentDelete}
                             onCommentUpdate={this.handleCommentUpdate}
                    />
                <CommentForm onCommentSubmit={this.handleCommentSubmit} postId={this.props.postId}/>
            </div>
        )
    }
    handleCommentSubmit(comment) {
        if(this.props.parentCommentId){
            comment.commentId = this.props.parentCommentId;
        }
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
                let commentArray = this.state.comments.filter((comment)=> {
                    return comment.id !== commentId;
                });
                this.setState({comments: commentArray})
            }, (err)=> {
                this.context.errorHandler.alertError(err);
            });
    }

    handleCommentUpdate(comment){
        "use strict";
        this.context.commentServices.updateComment(comment)
            .then((result)=>{
                let commentArray = this.state.posts;
                commentArray.forEach((comment)=>{
                    if(comment.id === result.id){
                        commentArray[commentArray.indexOf(comment)].text = result.text;
                        return;
                    }
                });
                this.setState({comments: commentArray});
            },(err)=>{
                this.context.errorHandler.alertError(err);
            })
    }

    populate(props){
        if(props.comments){
            this.setState({comments: props.comments})
        }
    }

    componentWillReceiveProps(nextProps){
        this.populate(nextProps);
    }
    componentDidMount(){
        this.populate(this.props);
    }
}
CommentComponent.propTypes = {
    postId: React.PropTypes.number.isRequired,
    postAuthor: React.PropTypes.string.isRequired,
    comments: React.PropTypes.arrayOf(
        React.PropTypes.shape({
            id: React.PropTypes.number.isRequired,
            authorUsername: React.PropTypes.string.isRequired,
            text: React.PropTypes.string.isRequired,
            date_created: React.PropTypes.string.isRequired
        })
    ),
    parentCommentId: React.PropTypes.number
};
CommentComponent.contextTypes = {
    authServices: React.PropTypes.object,
    commentServices: React.PropTypes.object,
    errorHandler: React.PropTypes.object
};
