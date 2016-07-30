"use strict";

import React from "react";
//import getMarkDown from "../../common/markdown";

export default class User extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    render() {
        return (
            <div className="user col-md-12">
                <h2 className="username">
                    {this.props.user.firstName} {this.props.user.lastName} ({this.props.user.username})
                </h2>
            </div>
        );
    }
}

User.propTypes = {
    user: React.PropTypes.shape({
        id: React.PropTypes.number.isRequired,
        username: React.PropTypes.string.isRequired,
        firstName: React.PropTypes.string,
        lastName: React.PropTypes.string,
        email: React.PropTypes.string,
    }),
    children: React.PropTypes.any,
};