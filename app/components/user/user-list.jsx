'use strict';

import React from "react";
import User from "./user";

export default class UserList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let userNodes = this.props.data.map((user)=> {
            return (
                <User handleUserDelete={this.props.handleUserDelete} handleUserEdit={this.props.handleUserEdit} user={user} key={user.id}/>
            );
        });

        return (
            <div className="userList">
                {userNodes}
            </div>
        );
    }
}
UserList.propTypes = {
    data: React.PropTypes.arrayOf(
        React.PropTypes.shape({
            id: React.PropTypes.number,
            username: React.PropTypes.string,
            firstName: React.PropTypes.string,
            lastName: React.PropTypes.string,
            email: React.PropTypes.string,
            dateOfBirth: React.PropTypes.any
        })
    ),
    handleUserEdit: React.PropTypes.func,
    handleUserDelete: React.PropTypes.func
};

