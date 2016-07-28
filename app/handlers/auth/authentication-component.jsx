'use strict';

import React from "react";
import RegisterForm from "./register-form";
import LoginForm from "./login-form";
import errorHandler from "../error-handler"

export default class AuthenticationComponent extends React.Component{

     constructor(prop, context){
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
    onUserLogin(user){
        this.context.authServices.userLogin(user)
            .then((result)=>{
                this.context.authServices.storeData('user', {account: result});
                this.context.router.push({pathname: '/'});
        }, (err)=>{
                errorHandler(err.status, err.statusText, this.context.authServices, this.context.router);
            });
    }
    onUserRegister(user){
        this.context.authServices.userRegister(user)
            .then((result)=>{
                console.log(result);
            }, (err)=>{
                errorHandler(err.status, err.statusText, this.context.authServices, this.context.router);
            });
    }
    componentDidMount(){
        if(this.context.authServices.isAuthenticated()){
           this.context.router.push({pathname: '/'});
        }
    }
}
AuthenticationComponent.contextTypes = {
    authServices: React.PropTypes.object,
    router: React.PropTypes.object,
};
