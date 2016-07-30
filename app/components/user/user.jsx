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
            <div className="user col-md-4">
                <h2 className="name">
                    {this.props.user.firstName} {this.props.user.lastName}
                </h2>
                ({this.props.user.username})

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
        dateOfBirth: React.PropTypes.string,
    }),
    children: React.PropTypes.any,
};