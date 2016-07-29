'use strict';

import React from "react";
import User from "./user";
import PasswordChangeForm from "./password-change-form";
import UserEditForm from "./user-edit-form";
import PostComponent from "../post/post-component";

export default class UserPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        /**
         * password change mode
         */
        if (this.props.mode === 'password') {
            return (
                <div className="userPage">
                    <PasswordChangeForm user={this.props.user} handlePasswordChange={this.props.handlePasswordChange}/>
                </div>
            );
        }
        if (this.props.mode === 'edit') {
            return (
                <div className="userPage">
                    <UserEditForm user={this.props.user} handleUserEdit={this.props.handleUserEdit}/>
                </div>
            );
        }

        return (
            <div className="userPage">
                <User username={this.props.user.username} userId={this.props.user.id}/>

                <div className="userRelatedPosts">
                    <PostComponent username={this.props.user.username}/>
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
    mode: React.PropTypes.string.isRequired,

    handlePasswordChange: React.PropTypes.func.isRequired,
    handleUserEdit: React.PropTypes.func.isRequired,

    //onCommentDelete: React.PropTypes.func
};

