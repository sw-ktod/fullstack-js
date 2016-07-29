'use strict';

import React from "react";
import User from "./user";
import { Link } from "react-router";

export default class UserList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let userNodes = this.props.data.map((user)=> {
            let link = '/users/' + user.username;
            return (
                <Link key={user.id} to={link}>
                    <User username={user.username} key={user.id} userId={user.id}/>
                </Link>
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
        })
    ),
};

