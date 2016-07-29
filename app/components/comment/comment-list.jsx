'use strict';

import React from "react";
import Comment from "./comment";
import CommentComponent from "./comment-component.jsx";

export default class CommentList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let comments = this.props.data
            .filter((comment)=>{
                if(!comment.commentId){
                    return true;
                }
                return comment.commentId === this.props.parentCommentId
        });
        let remaining = this.props.data.filter((c)=>{
            return (comments.indexOf(c) < 0 && c.commentId);
        });
        let commentNodes = comments
            .map((comment)=> {

                return (
                    <div className="well well-sm" key={comment.id}>
                        <Comment postAuthor={this.props.postAuthor}
                                 author={comment.authorUsername}
                                 commentId={comment.id}
                                 created={comment.date_created}
                                 onCommentDelete={this.props.onCommentDelete}>
                            {comment.text}
                        </Comment>
                        <CommentComponent postId={this.props.postId} parentCommentId={comment.id} postAuthor={this.props.postAuthor} comments={remaining} />
                    </div>
                );
            });
        return (
            <div className="commentsList">
                {commentNodes}
            </div>
        );
    }
}
CommentList.propTypes = {
    data: React.PropTypes.arrayOf(
        React.PropTypes.shape({
            id: React.PropTypes.number.isRequired,
            authorUsername: React.PropTypes.string.isRequired,
            text: React.PropTypes.string.isRequired,
            date_created: React.PropTypes.string.isRequired
        })
    ),
    parentCommentId: React.PropTypes.number,
    postId: React.PropTypes.number.isRequired,
    postAuthor: React.PropTypes.string.isRequired,
    onCommentDelete: React.PropTypes.func.isRequired,
};

