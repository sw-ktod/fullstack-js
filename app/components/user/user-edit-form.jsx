'use strict';

import React from "react";

export default class UserEdit extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            password: '',
            newPassword: '',
            confirmPassword: '',
        };
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleNewPasswordChange = this.handleNewPasswordChange.bind(this);
        this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handlePasswordChange(e) {
        this.setState({password: e.target.value});
    }
    handleNewPasswordChange(e) {
        this.setState({newPassword: e.target.value});
    }
    handleConfirmPasswordChange(e) {
        this.setState({confirmPassword: e.target.value});
    }
    handleSubmit(e) {
        e.preventDefault();
        let password = this.state.password.trim();
        let newPassword = this.state.newPassword.trim();
        let confirmPassword = this.state.confirmPassword.trim();

        if (!password || !confirmPassword || newPassword !== confirmPassword) {
            return;
        }

        this.props.handleUserEdit({password: password, newPassword: newPassword});

        this.setState({
            password: '',
            newPassword: '',
            confirmPassword: ''
        });
    }
    render() {
        return (
            <form className="col-md-6 text-center">
                <h2>Edit profile: </h2>
                <div className="form-group">
                    <label className="control-label" htmlFor="username">Username </label>
                    <input disabled className="input-sm form-control" type="text" value={this.props.user.username} id="username"/>
                </div>
                <div className="form-group">
                    <label className="control-label" htmlFor="password">New Password </label>
                    <input className="input-sm form-control" type="password" value={this.state.newPassword} id="password"
                           onChange={this.handleNewPasswordChange} />
                </div>
                <div className="form-group">
                    <label className="control-label" htmlFor="confirmPassword">Confirm password </label>
                    <input className="input-sm form-control" type="password" value={this.state.confirmPassword} id="confirmPassword"
                           onChange={this.handleConfirmPasswordChange} />
                </div>
                <div className="form-group">
                    <label className="control-label" htmlFor="password">Current Password </label>
                    <input className="input-sm form-control" type="password" value={this.state.password} id="password"
                           onChange={this.handlePasswordChange} />
                </div>
                <input className="input-sm form-control" type="submit" value="Edit Profile" onClick={this.handleSubmit} />
            </form>
        );
    }
}
UserEdit.propTypes = {
    user: React.PropTypes.shape({
        username: React.PropTypes.string.isRequired
    }),
    handleUserEdit: React.PropTypes.func.isRequired,

    //onCommentDelete: React.PropTypes.func
};

