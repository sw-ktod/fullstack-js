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
        if (!this.props.post.id) {
            return;
        }
        this.props.onPostDelete(this.props.post.id);
    }

    render() {
        let currentUser = this.context.authServices.getStoredData('user').account;

        let authorLink = "/users/" + this.props.post.authorUsername;
        let link;
        if (this.props.post.receiverUsername) {
            let receiverLink = "/users/" + this.props.post.receiverUsername;
            link = <Link to={receiverLink}>{this.props.post.receiverUsername} </Link>
        }
        let deleteButton = (this.props.post.authorUsername === currentUser.username || this.props.post.receiverUsername === currentUser.username) ?
            (<a className="cursor-pointer pull-right" onClick={this.handleDelete}>x</a>) : '';
        return (
            <div>
                <h3 className="postAuthor">
                    <Link to={authorLink}> {this.props.post.authorUsername}</Link>
                    {deleteButton}
                    {link ? '->' : ''}
                    {link ? link : ''}:
                </h3>
                <span dangerouslySetInnerHTML={this.rawMarkup()}/>
                <h5>{this.props.post.date_created}</h5>
            </div>
        );
    }
}
//<button onClick={this.handleDelete}>Delete </button>

Post.propTypes = {
    post: React.PropTypes.shape({
        id: React.PropTypes.number.isRequired,
        authorUsername: React.PropTypes.string.isRequired,
        receiverUsername: React.PropTypes.string,
        text: React.PropTypes.string.isRequired,
        date_created: React.PropTypes.string.isRequired
    }),
    children: React.PropTypes.node,
    onPostDelete: React.PropTypes.func
};
Post.contextTypes = {
    authServices: React.PropTypes.object
};