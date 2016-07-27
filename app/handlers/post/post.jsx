"use strict";

import React from "react";
import Remarkable from "remarkable";
import { Link } from "react-router";

export default class Post extends React.Component {
    constructor(props){
        super(props);
        this.props = props;
        //this.handleDelete = this.handleDelete.bind(this);
    }

    rawMarkup() {
        let md = new Remarkable();
        let rawMarkup = md.render(this.props.children);
        return {
            __html: rawMarkup
        }
    }

    render() {
        let authorLink = "/users/" + this.props.author;
        let link;
        if(this.props.receiver){
            let receiverLink = "/users/" + this.props.receiver;
            link = <Link to={receiverLink}>{this.props.receiver} </Link>
        }
        return (
            <div>
                    <h3 className="postAuthor">
                        <Link to={authorLink}> {this.props.author}</Link>
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
    author: React.PropTypes.string.isRequired,
    receiver: React.PropTypes.string,
    created: React.PropTypes.string.isRequired,
    children: React.PropTypes.any,
    //handleCommentDelete: React.PropTypes.func
};