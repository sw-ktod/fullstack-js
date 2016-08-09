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
        if (this.props.mode === 'password') {
            /**
             * password change mode
             */
            return (
                <div className="userPage">
                    <PasswordChangeForm user={this.props.user} handlePasswordChange={this.props.handlePasswordChange}/>
                </div>
            );
        } else if (this.props.mode === 'edit') {
            /**
             * user edit mode
             */
            return (
                <div className="userPage">
                    <UserEditForm user={this.props.user} handleUserEdit={this.props.handleUserEdit}/>
                </div>
            );
        } else{
            /**
             * user view mode
             */
            return (
                <div className="userPage">
                    <User user={this.props.user} handleUserEdit={this.props.handleUserEdit} handleUserDelete={this.props.handleUserDelete}/>
                    <div className="col-md-12 userRelatedPosts">
                        <PostComponent username={this.props.user.username} />
                    </div>
                </div>
            );
        }

    }
}
UserPage.propTypes = {
    user: React.PropTypes.shape({
        id: React.PropTypes.number.isRequired,
        username: React.PropTypes.string.isRequired,
        firstName: React.PropTypes.string,
        lastName: React.PropTypes.string,
        email: React.PropTypes.string,
    }),
    mode: React.PropTypes.string,

    handlePasswordChange: React.PropTypes.func.isRequired,
    handleUserEdit: React.PropTypes.func.isRequired,
    handleUserDelete: React.PropTypes.func.isRequired,

    //onCommentDelete: React.PropTypes.func
};

