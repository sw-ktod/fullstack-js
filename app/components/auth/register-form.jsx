'use strict';

import React from "react";

export default class UserRegisterForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
            confirmPassword: '',
        }
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleUsernameChange(e) {
        this.setState({username: e.target.value});
    }
    handlePasswordChange(e) {
        this.setState({password: e.target.value});
    }
    handleConfirmPasswordChange(e) {
        this.setState({confirmPassword: e.target.value});
    }
    handleSubmit(e) {
        e.preventDefault();
        let username = this.state.username.trim();
        let password = this.state.password.trim();
        let confirmPassword = this.state.confirmPassword.trim();

        if(!username || !password || !confirmPassword || password !== confirmPassword){
            return ;
        }

        this.props.onUserRegister({username: username, password: password});

        this.setState({
            username: '',
            password: '',
            confirmPassword: '',
        });
    }

    render() {
        return (
            <form className="col-md-6 text-center">
                <h2>Register</h2>
                <div className="form-group">
                    <label className="control-label" htmlFor="username">Username </label>
                    <input className="input-sm form-control" type="text" value={this.state.username} id="username"
                        onChange={this.handleUsernameChange} />
                </div>
                <div className="form-group">
                    <label className="control-label" htmlFor="password">Password </label>
                    <input className="input-sm form-control" type="password" value={this.state.password} id="password"
                        onChange={this.handlePasswordChange} />
                </div>
                <div className="form-group">
                    <label className="control-label" htmlFor="confirmPassword">Confirm password </label>
                    <input className="input-sm form-control" type="password" value={this.state.confirmPassword} id="confirmPassword"
                        onChange={this.handleConfirmPasswordChange} />
                </div>
                <input className="input-sm form-control" type="submit" value="Register" onClick={this.handleSubmit} />
            </form>
        );
    }
}
UserRegisterForm.propTypes = {
    onUserRegister: React.PropTypes.func,
};