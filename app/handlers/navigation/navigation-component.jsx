'use strict';

import React from "react";
import { Link } from "react-router";
import $ from "jquery";

export default class NavigationComponent extends React.Component{
    constructor(props, context){
        super(props, context);
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.onUserLogout = this.onUserLogout.bind(this);
    }
    render() {
        if(!this.context.authServices.isAuthenticated()){
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
        let user = this.context.authServices.getStoredData('user');
        let linkToUser = "/users/" + user.account.username;
        let linkToUserEdit = linkToUser + "/edit";
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
                                    <Link to={linkToUser}> {user.account.username} </Link>
                                </li>
                                <li>
                                    <Link to={linkToUserEdit}> Edit Profile </Link>
                                </li>
                                <li className="divider"/>
                                <li>
                                    <a className="cursor-pointer" onClick={this.onUserLogout} >Logout</a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
    onUserLogout(){
        this.context.authServices.handleUserLogout()
            .then(()=>{
                this.context.authServices.removeStoredData('user');
                this.context.router.push({pathname: '/auth'});
            }
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
NavigationComponent.contextTypes = {
    authServices: React.PropTypes.object,
    router: React.PropTypes.object,
};

