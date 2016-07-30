"use strict";

import React from "react";
import { Link } from "react-router";
import getMarkDown from "../../common/markdown";

export default class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.onCommentDelete = this.onCommentDelete.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.triggerEditMode = this.triggerEditMode.bind(this);
        this.onCommentUpdate = this.onCommentUpdate.bind(this);
        this.state = {
            editMode: undefined,
            text: this.props.children
        }
    }
    handleTextChange(e){
        this.setState({text: e.target.value});
    }

    onCommentDelete() {
        let commentId = this.props.commentId;
        if (!commentId) {
            return;
        }
        this.props.onCommentDelete(commentId);
    }
    onCommentUpdate(){
        this.props.onCommentUpdate({id: this.props.commentId, text: this.state.text});
        this.triggerEditMode();
    }
    triggerEditMode(){
        this.setState({editMode: !this.state.editMode})
    }

    render() {
        let currentUser = this.context.authServices.getStoredData('user').account;
        let authorLink = "/users/" + this.props.author;
        let deleteButton = (this.props.author === currentUser.username || this.props.postAuthor === currentUser.username || currentUser.role > 0) ?
            (<a className="cursor-pointer pull-right" onClick={this.onCommentDelete}>x</a>) : '';
        let editButton = (this.props.author === currentUser.username || currentUser.role > 0) ?
            (<a className="cursor-pointer pull-right" onClick={this.triggerEditMode}>Edit</a>) : '';
        let cancelButton = (<a className="cursor-pointer pull-right" onClick={this.triggerEditMode} >Cancel</a>);
        let submitButton = (<a className="cursor-pointer pull-right" onClick={this.onCommentUpdate} >Submit</a>);

        if(this.state.editMode){
            return (
                <div className="comment well-sm bs-component col-md-12">
                    <h4 className="commentAuthor col-md-4">
                        <Link to={authorLink}> {this.props.author} </Link>
                        {cancelButton}
                        {submitButton}
                    </h4>

                    <input type="text" onChange={this.handleTextChange} value={this.state.text} />
                    <h6 className="col-md-12">{this.props.created}</h6>
                </div>

            )
        }

        return (
            <div className="comment well-sm bs-component col-md-12">
                <h4 className="commentAuthor col-md-4">
                    <Link to={authorLink}> {this.props.author} </Link>
                    {editButton}
                    {deleteButton}
                </h4>

                <span className="col-md-12" dangerouslySetInnerHTML={getMarkDown(this.state.text)}/>
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
    onCommentDelete: React.PropTypes.func.isRequired,
    onCommentUpdate: React.PropTypes.func.isRequired
};
Comment.contextTypes = {
    authServices: React.PropTypes.object
};