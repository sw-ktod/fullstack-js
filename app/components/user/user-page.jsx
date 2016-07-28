'use strict';

import React from "react";
import User from "./user";
import UserEditForm from "./user-edit-form";
import PostList from "../post/post-list";
import PostForm from "../post/post-form";

export default class UserPage extends React.Component{
    constructor(props){
        super(props);
    }
        render() {
            if(this.props.editMode){
                return(
                    <div className="userPage">
                        <UserEditForm user={this.props.user} handleUserEdit={this.props.handleUserEdit} />

                    </div>
                );
            }
            return (
                <div className="userPage">
                    <User username={this.props.user.username} userId={this.props.user.id}/>

                    <div className="userRelatedPosts">
                        <PostForm onPostSubmit={this.props.handlePostSubmit} receiverUsername={this.props.user.username} />
                        <br />
                        <PostList posts={this.props.posts} comments={this.props.comments}
                                  handleCommentSubmit={this.props.handleCommentSubmit}
                                  handleCommentDelete={this.props.handleCommentDelete}
                                  handlePostDelete={this.props.handlePostDelete}
                        />
                    </div>
                </div>
            );
        }
}
UserPage.propTypes = {
    user: React.PropTypes.shape({
        id: React.PropTypes.number,
        username: React.PropTypes.string
    }),
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
    editMode: React.PropTypes.bool.isRequired,

    handlePostSubmit: React.PropTypes.func.isRequired,
    handlePostDelete: React.PropTypes.func.isRequired,
    handleCommentSubmit: React.PropTypes.func.isRequired,
    handleCommentDelete: React.PropTypes.func.isRequired,
    handleUserEdit: React.PropTypes.func.isRequired,

    //onCommentDelete: React.PropTypes.func
};

