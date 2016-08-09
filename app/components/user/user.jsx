"use strict";

import React from "react";
import { Link } from "react-router";
export default class User extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.props = props;
        this.onUserDelete = this.onUserDelete.bind(this);
    }

    render() {
        let currentUser = this.context.authServices.getStoredData('user').account;

        let deleteButton = (currentUser.role > 0) ?
            (<a className="cursor-pointer pull-right" onClick={this.onUserDelete}>x</a>) : '';
        let editButton = (currentUser.role > 0) ?
            (<Link to={`/users/${this.props.user.username}/edit`} className="cursor-pointer pull-right">Edit</Link>) : '';
        let link = '/users/' + this.props.user.username;

        return (
            <div className="user col-md-3">
                {editButton}
                {deleteButton}
                <Link to={link}>
                    <h2 className="name">
                        {this.props.user.firstName} {this.props.user.lastName}
                    </h2>
                    ({this.props.user.username})
                </Link>
            </div>)
    }
    onUserDelete(e){
        e.preventDefault();
        if(!this.props.user.username){
            return;
        }
        this.props.handleUserDelete(this.props.user.username);
    }
}

User.propTypes = {
    user: React.PropTypes.shape({
        id: React.PropTypes.number.isRequired,
        username: React.PropTypes.string.isRequired,
        firstName: React.PropTypes.string,
        lastName: React.PropTypes.string,
        email: React.PropTypes.string,
        dateOfBirth: React.PropTypes.any
    }),
    children: React.PropTypes.any,
    handleUserDelete: React.PropTypes.func,
};
User.contextTypes = {
    authServices: React.PropTypes.object,
};