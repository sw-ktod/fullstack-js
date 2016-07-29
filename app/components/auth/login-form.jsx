'use strict';

import React from "react";

export default class UserLoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleUsernameChange(e) {
        this.setState({username: e.target.value});
    }

    handlePasswordChange(e) {
        this.setState({password: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        let username = this.state.username.trim();
        let password = this.state.password.trim();

        if (!username || !password) {
            return;
        }

        this.props.onUserLogin({username: username, password: password});

        this.setState({
            password: '',
        });
    }

    render() {
        return (
            <form className="col-md-6 text-center">
                <h2>Login</h2>

                <div className="form-group">
                    <label className="control-label" htmlFor="username">Username </label>
                    <input className="input-sm form-control" type="text" value={this.state.username} id="username"
                           onChange={this.handleUsernameChange}/>
                </div>
                <div className="form-group">
                    <label className="control-label" htmlFor="password">Password </label>
                    <input className="input-sm form-control" type="password" value={this.state.password} id="password"
                           onChange={this.handlePasswordChange}/>
                </div>
                <input className="input-sm form-control" type="submit" value="Login" id="submit"
                       onClick={this.handleSubmit}/>
            </form>
        );
    }
}
UserLoginForm.propTypes = {
    onUserLogin: React.PropTypes.func.isRequired
}