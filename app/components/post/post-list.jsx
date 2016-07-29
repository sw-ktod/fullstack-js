'use strict';

import React from "react";
import Post from "./post";
import CommentForm from "../comment/comment-form";
import CommentList from "../comment/comment-list";
//import CommentServices from "../comment/comment-services";

export default class PostList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let postComments = [];

        let postNodes = this.props.posts.map((post)=> {
            if (this.props.comments) {
                postComments = this.props.comments.filter((comment)=> {
                    return comment.postId === post.id;
                });

                return (
                    <div className="jumbotron" key={post.id}>
                        <Post author={post.authorUsername} postId={post.id} created={post.date_created}
                              receiver={post.receiverUsername} onPostDelete={this.props.handlePostDelete}>
                            {post.text}
                        </Post>
                        <CommentList postAuthor={post.authorUsername} data={postComments}
                                     onCommentDelete={this.props.handleCommentDelete}/>
                        <CommentForm onCommentSubmit={this.props.handleCommentSubmit} postId={post.id}/>
                    </div>
                );
            }
        });
        return (
            <div className="postList">
                {postNodes}
            </div>
        );
    }
}
PostList.propTypes = {
    posts: React.PropTypes.arrayOf(
        React.PropTypes.shape({
            id: React.PropTypes.number.isRequired,
            authorUsername: React.PropTypes.string.isRequired,
            receiverUsername: React.PropTypes.string,
            text: React.PropTypes.string.isRequired,
            date_created: React.PropTypes.string.isRequired
        })
    ),
    comments: React.PropTypes.arrayOf(
        React.PropTypes.shape({
            id: React.PropTypes.number.isRequired,
            authorUsername: React.PropTypes.string.isRequired,
            text: React.PropTypes.string.isRequired,
            date_created: React.PropTypes.string.isRequired
        })
    ),
    handleCommentSubmit: React.PropTypes.func,
    handleCommentDelete: React.PropTypes.func,
    handlePostDelete: React.PropTypes.func
};

