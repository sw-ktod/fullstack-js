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
            .then((result)=> {
                if(result.role < 1){
                    delete result.role;
                }
                this.context.authServices.storeData('user', {account: result});
                if (!result.email) {
                    this.context.router.push({pathname: '/users/' + result.username + '/edit'});
                } else {
                    this.context.router.push({pathname: '/'});
                }
            }, (err)=> {
                this.context.errorHandler.alertError(err);
            });
    }

    onUserRegister(user) {
        this.context.authServices.userRegister(user)
            .then((result)=> {
                console.log(result);
            }, (err)=> {
                this.context.errorHandler.alertError(err);
            });
    }

    //grandAdmin
    //removeAdmin

    componentDidMount() {
        if (this.context.authServices.isAuthenticated()) {
            this.context.router.push({pathname: '/'});
        }
    }
}
AuthenticationComponent.contextTypes = {
    authServices: React.PropTypes.object,
    errorHandler: React.PropTypes.object,
    router: React.PropTypes.object,
};
