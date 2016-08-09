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
        this.cancelEdit = this.cancelEdit.bind(this);
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
    onCommentUpdate(e){
        e.preventDefault();
        this.props.onCommentUpdate({id: this.props.commentId, text: this.state.text});
        this.triggerEditMode();
    }
    triggerEditMode(){
        this.setState({editMode: !this.state.editMode})
    }
    cancelEdit(e){
        e.preventDefault();

        if(this.state.text !== this.props.children){
            this.setState({text: this.props.children});
        }
        this.triggerEditMode();
    }

    render() {
        let currentUser = this.context.authServices.getStoredData('user').account;
        let authorLink = "/users/" + this.props.author;
        let deleteButton = (this.props.author === currentUser.username || this.props.postAuthor === currentUser.username || currentUser.role > 0) ?
            (<a className="cursor-pointer pull-right" onClick={this.onCommentDelete}>x</a>) : '';
        let editButton = (this.props.author === currentUser.username || currentUser.role > 0) ?
            (<a className="cursor-pointer pull-right" onClick={this.triggerEditMode}>Edit</a>) : '';

        if(this.state.editMode){
            return (
                <div className="comment well-sm bs-component col-md-12">
                    <h4 className="commentAuthor col-md-4">
                        <Link to={authorLink}> {this.props.author} </Link>
                    </h4>
                    <input type="text" onChange={this.handleTextChange} value={this.state.text} />
                    <input type="button" onClick={this.onCommentUpdate} value="Update" />
                    <input type="submit" onClick={this.cancelEdit} value="Cancel" />
                    <h6 className="col-md-12">{this.props.created}</h6>
                </div>

            )
        }

        return (
            <div className="comment well-sm bs-component col-md-12">
                <h4 className="commentAuthor col-md-4">
                    <Link to={authorLink}> {this.props.author} </Link>
                </h4>
                {editButton}
                {deleteButton}
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