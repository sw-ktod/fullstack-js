"use strict";

import React from "react";
import Remarkable from "remarkable";
import { Link } from "react-router";

export default class Post extends React.Component {
    constructor(props, context) {
        super(props, context);
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
        let postId = this.props.postId;
        if (!postId) {
            return;
        }
        this.props.onPostDelete(postId);
    }

    render() {
        let currentUser = this.context.authServices.getStoredData('user').account;

        let authorLink = "/users/" + this.props.author;
        let link;
        if (this.props.receiver) {
            let receiverLink = "/users/" + this.props.receiver;
            link = <Link to={receiverLink}>{this.props.receiver} </Link>
        }
        let deleteButton = (this.props.author === currentUser.username || this.props.receiver === currentUser.username) ?
            (<a className="cursor-pointer pull-right" onClick={this.handleDelete}>x</a>) : '';
        return (
            <div>
                <h3 className="postAuthor">
                    <Link to={authorLink}> {this.props.author}</Link>
                    {deleteButton}
                    {link ? '->' : ''}
                    {link ? link : ''}:
                </h3>
                <span dangerouslySetInnerHTML={this.rawMarkup()}/>
                <h5>{this.props.created}</h5>
            </div>
        );
    }
}
//<button onClick={this.handleDelete}>Delete </button>

Post.propTypes = {
    postId: React.PropTypes.number.isRequired,
    author: React.PropTypes.string.isRequired,
    receiver: React.PropTypes.string,
    created: React.PropTypes.string.isRequired,
    children: React.PropTypes.any,
    onPostDelete: React.PropTypes.func
};
Post.contextTypes = {
    authServices: React.PropTypes.object
};