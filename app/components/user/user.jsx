"use strict";

import React from "react";
import Remarkable from "remarkable";

export default class User extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        //this.handleDelete = this.handleDelete.bind(this);
    }

    rawMarkup() {
        if (this.props.children) {
            let md = new Remarkable();
            let rawMarkup = md.render(this.props.children.toString());
            return {
                __html: rawMarkup
            }
        }
    }

    //handleDelete(){
    //    let commentId = this.props.commentId;
    //    if(!commentId){
    //        return;
    //    }
    //    this.props.handleCommentDelete(commentId);
    //}

    render() {
        return (
            <div className="user col-md-12">
                <h2 className="username">
                    {this.props.user.firstName} {this.props.user.lastName} ({this.props.user.username})
                </h2>
                <span dangerouslySetInnerHTML={this.rawMarkup()}/>
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
    //handleCommentDelete: React.PropTypes.func
};