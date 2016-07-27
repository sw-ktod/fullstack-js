'use strict';

import React from "react";
import User from "./user";
import PostList from "../post/post-list";
import PostForm from "../post/post-form";

export default class UserEdit extends React.Component{
    constructor(props){
        super(props);
    }
    render() {
        return (
            <div className="userEdit">
            <User username={this.props.user.username} userId={this.props.user.id}/>

            <div className="userRelatedPosts">
                Posts:
            <PostList posts={this.props.posts} comments={this.props.comments} handleCommentSubmit={this.props.handleCommentSubmit} />
            <PostForm onPostSubmit={this.props.handlePostSubmit}/>
            </div>
            </div>
            );
            }
}
UserPage.propTypes = {
    user: React.PropTypes.any.isRequired,
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
    handlePostSubmit: React.PropTypes.func.isRequired,
    handleCommentSubmit: React.PropTypes.func.isRequired

    //onCommentDelete: React.PropTypes.func
};

