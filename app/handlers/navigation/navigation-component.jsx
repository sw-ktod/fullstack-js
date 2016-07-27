'use strict';

import React from "react";
import { Link } from "react-router";
import AuthServices from "../auth/authentication-component";
import $ from "jquery";

export default class NavigationComponent extends React.Component{
    constructor(props){
        super(props);
        this.toggleDropdown = this.toggleDropdown.bind(this);
    }
    render() {
        if(!AuthServices.isAuthenticated()){
            return (
                <nav className="navbar navbar-default">
                    <div className="container-fluid">
                        <ul className="nav navbar-nav">
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            )
        }
        let user = AuthServices.getCookieData('user');
        let linkToUser = "/users/" + user.account.username;
        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <ul className="nav navbar-nav">
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/users">Users</Link>
                        </li>
                    </ul>
                    <ul className="navbar-right nav navbar-nav">
                        <li>
                            <Link to={linkToUser}> {user.account.username} </Link>
                        </li>
                        <li className="dropdown" onClick={this.toggleDropdown}>
                            <a className="dropdown-toggle cursor-pointer" data-toggle="dropdown" id="userNav"> <span className="caret"></span> </a>
                            <ul className="dropdown-menu" aria-labelledb="userNav">
                                <li>
                                    <Link to={linkToUser}> Profile </Link>
                                </li>
                                <li className="divider"/>
                                <li>
                                    <a href="/" onClick={AuthServices.handleUserLogout} >Logout</a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
    toggleDropdown(){
        $('.dropdown').click(function(){
            $('.dropdown').addClass('open')
        });

        $(document).click(function(e) {
            var target = e.target;
            if (!$(target).is('.dropdown-toggle') && !$(target).parents().is('.dropdown-toggle')) {
                $('.dropdown').removeClass('open');
            }
        })
    }

}

