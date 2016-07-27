'use strict';

import React from "react";
import UserRegisterForm from "./user-register-form";
import UserLoginForm from "./user-login-form";
import $ from "jquery";
import { browserHistory } from 'react-router';
import errorHandler from "../error-handler";

export default class AuthenticationServices extends React.Component{

    static getCookieData(key){
        return JSON.parse(localStorage[key]);
    }
    static isAuthenticated() {
        return (localStorage.hasOwnProperty('user'));
    }
    static validateAuthentication() {
        let url = "/api/auth";
        $.ajax({
            method: "GET",
            url: url,
            cache: false
        }).done((user)=> {
            if(!user){
                localStorage.removeItem('user');
                browserHistory.push('/auth');
            }else{
                localStorage.setItem('user', JSON.stringify(user));
            }
        }).fail((xhr, status, err)=> {
            errorHandler(url, xhr, err.toString());
        });
    }
    static handleUserLogout() {
        let url = "/api/auth/logout";

        $.ajax({
            method: "GET",
            url: url,
            cache: false
        }).done(()=> {
            localStorage.removeItem('user');
        }).fail((xhr, status, err)=> {
            errorHandler(url, xhr, err.toString());
        });
    }

    constructor(props){
        super(props);
        this.url = "/api/auth";
        this.handleUserRegister = this.handleUserRegister.bind(this);
        this.handleUserLogin = this.handleUserLogin.bind(this);
    }
    render() {
        return (
            <div>
                <UserLoginForm onUserLogin={this.handleUserLogin}/>
                <UserRegisterForm onUserRegister={this.handleUserRegister}/>
            </div>
        )
    }
    handleUserRegister (user){
    let url = this.url + "/register";
        $.ajax({
            method: 'POST',
            url: url,
            dataType: "json",
            data: user,
            cache: false,
        }).done((data)=>{
            console.log(data);
            //this.setState({data: data})
        }).fail((xhr,status,err)=>{
            errorHandler(url, xhr, err.toString());
        })
    }
    handleUserLogin (user){
        let url = this.url + "/login";
        $.ajax({
            method: 'POST',
            url: url,
            dataType: "json",
            data: user,
            cache: false,
        }).done((data)=>{
            localStorage.setItem('user', JSON.stringify(data));
            browserHistory.push('/');
    }).fail((xhr,status,err)=>{
            errorHandler(url, xhr, err.toString());
        })
    }

    componentDidMount(){
        if(AuthenticationServices.isAuthenticated()){
            browserHistory.push('/');
        }
    }
}
AuthenticationServices.propTypes = {
};