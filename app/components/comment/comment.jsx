"use strict";

import React from "react";
import Remarkable from "remarkable";
import { Link } from "react-router";

export default class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.handleDelete = this.handleDelete.bind(this);
    }

    rawMarkup() {
        let md = new Remarkable();
        let rawMarkup = md.render(this.props.children);
        return {
            __html: rawMarkup
        }
    }

    handleDelete() {
        let commentId = this.props.commentId;
        if (!commentId) {
            return;
        }
        this.props.onCommentDelete(commentId);
    }

    render() {
        let currentUser = this.context.authServices.getStoredData('user').account;
        let authorLink = "/users/" + this.props.author;
        let deleteButton = (this.props.author === currentUser.username || this.props.postAuthor === currentUser.username) ?
            (<a className="cursor-pointer pull-right" onClick={this.handleDelete}>x</a>) : '';

        return (
            <div className="comment well bs-component col-md-12">
                <h4 className="commentAuthor col-md-4">
                    <Link to={authorLink}> {this.props.author} </Link>
                    {deleteButton}
                </h4>

                <span className="col-md-12" dangerouslySetInnerHTML={this.rawMarkup()}/>
                <h6 className="col-md-12">{this.props.created}</h6>

            </div>
        );
    }
}

Comment.propTypes = {
    commentId: React.PropTypes.number.isRequired,
    postAuthor: React.PropTypes.string.isRequired,
    author: React.PropTypes.string.isRequired,
    created: React.PropTypes.string.isRequired,
    children: React.PropTypes.any,
    onCommentDelete: React.PropTypes.func.isRequired
};
Comment.contextTypes = {
    authServices: React.PropTypes.object
};