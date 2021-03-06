'use strict';

import React from "react";
import RegisterForm from "./register-form";
import LoginForm from "./login-form";

export default class AuthenticationComponent extends React.Component {

    constructor(prop, context) {
        super(prop, context);
        this.onUserLogin = this.onUserLogin.bind(this);
        this.onUserRegister = this.onUserRegister.bind(this);

    }

    render() {
        return (
            <div>
                <LoginForm onUserLogin={this.onUserLogin}/>
                <RegisterForm onUserRegister={this.onUserRegister}/>
            </div>
        )
    }

    onUserLogin(user) {
        this.context.authServices.userLogin(user)
            .then((response)=> {
                if (response.user.role < 1) {
                    delete response.user.role;
                }
                this.context.authServices.storeData("user", {account: response.user});
                if (!response.user.email) {
                    this.context.router.push({pathname: "/users/" + response.user.username + "/edit"});
                } else {
                    this.context.router.push({pathname: "/"});
                }
                this.context.responseHandler.success(response.message);
            }, (err)=> {
                this.context.responseHandler.error(err);
            });
    }

    onUserRegister(user) {
        this.context.authServices.userRegister(user)
            .then((response)=> {
                this.context.responseHandler.success(response.message);

            }, (err)=> {
                this.context.responseHandler.error(err);
            });
    }

    componentDidMount() {
        if (this.context.authServices.isAuthenticated()) {
            this.context.router.push({pathname: "/"});
        }
    }
}
AuthenticationComponent.contextTypes = {
    authServices: React.PropTypes.object,
    responseHandler: React.PropTypes.object,
    router: React.PropTypes.object,
};
