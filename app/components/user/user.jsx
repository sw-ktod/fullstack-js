"use strict";

import React from "react";
import Remarkable from "remarkable";

export default class User extends React.Component {
    constructor(props){
        super(props);
        this.props = props;
        //this.handleDelete = this.handleDelete.bind(this);
    }

    rawMarkup() {
        if(this.props.children){
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
            <div className="user">
                <h2 className="username">
                    {this.props.username}
                </h2>
                <span dangerouslySetInnerHTML={this.rawMarkup()}/>
            </div>
        );
    }
}

User.propTypes = {
    userId: React.PropTypes.number,
    username: React.PropTypes.string,
    children: React.PropTypes.any,
    //handleCommentDelete: React.PropTypes.func
};