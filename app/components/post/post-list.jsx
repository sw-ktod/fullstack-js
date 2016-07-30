'use strict';

import React from "react";
import Post from "./post";
import CommentComponent from "../comment/comment-component";

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
                        <Post post={post} onPostUpdate={this.props.handlePostUpdate} onPostDelete={this.props.handlePostDelete}>
                            {post.text}
                        </Post>
                        <CommentComponent postAuthor={post.authorUsername} comments={postComments}
                                          postId={post.id}/>
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
    handlePostDelete: React.PropTypes.func,
    handlePostUpdate: React.PropTypes.func
};

