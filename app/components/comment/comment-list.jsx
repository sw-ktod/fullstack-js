'use strict';

import React from "react";
import Comment from "./comment";

export default class CommentList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let commentNodes = this.props.data.map((comment)=> {
            return (
                <Comment postAuthor={this.props.postAuthor}
                         author={comment.authorUsername}
                         key={comment.id}
                         commentId={comment.id}
                         created={comment.date_created}
                         onCommentDelete={this.props.onCommentDelete}>
                    {comment.text}
                </Comment>
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
    postAuthor: React.PropTypes.string.isRequired,
    onCommentDelete: React.PropTypes.func.isRequired
};

