import React from "react";

import CommentForm from "../comment/comment-form";
import CommentList from "../comment/comment-list";

export default class CommentComponent extends React.Component{
    constructor(props, context){
        super(props, context);
        this.state = {
            comments: [],
        };
        this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
        this.handleCommentDelete = this.handleCommentDelete.bind(this);

    }
    render(){
        return (
            <div>
                <CommentList postAuthor={this.props.postAuthor} data={this.state.comments}
                             onCommentDelete={this.handleCommentDelete}/>
                <CommentForm onCommentSubmit={this.handleCommentSubmit} postId={this.props.postId}/>
            </div>
        )
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
    componentWillReceiveProps(nextProps){
        if(nextProps.postComments){
            this.setState({comments: nextProps.postComments})
        }
    }
}
CommentComponent.propTypes = {
    postId: React.PropTypes.number.isRequired,
    postAuthor: React.PropTypes.string.isRequired,
    postComments: React.PropTypes.arrayOf(
        React.PropTypes.shape({
            id: React.PropTypes.number.isRequired,
            authorUsername: React.PropTypes.string.isRequired,
            text: React.PropTypes.string.isRequired,
            date_created: React.PropTypes.string.isRequired
        })
    ),
    //commentId: React.PropTypes.number
};
CommentComponent.contextTypes = {
    authServices: React.PropTypes.object,
    commentServices: React.PropTypes.object,
    errorHandler: React.PropTypes.object
};
