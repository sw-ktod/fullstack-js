"use strict";

import React from "react";
import { Link } from "react-router";
import getMarkDown from "../../common/markdown";

export default class Post extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.props = props;
        this.triggerEditMode = this.triggerEditMode.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.onPostUpdate = this.onPostUpdate.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);

        this.state = {
            editMode: undefined,
            text: this.props.children
        }
    }

    handleTextChange(e){
        this.setState({text: e.target.value});
    }

    handleDelete() {
        if (!this.props.post.id) {
            return;
        }
        this.props.onPostDelete(this.props.post.id);
    }

    triggerEditMode(){
        this.setState({editMode: !this.state.editMode})
    }
    onPostUpdate(){
        this.props.onPostUpdate({id: this.props.post.id, text: this.state.text});
        this.triggerEditMode();
    }

    render() {
        let currentUser = this.context.authServices.getStoredData('user').account;

        let authorLink = "/users/" + this.props.post.authorUsername;
        let link;
        if (this.props.post.receiverUsername) {
            let receiverLink = "/users/" + this.props.post.receiverUsername;
            link = <Link to={receiverLink}>{this.props.post.receiverUsername} </Link>
        }
        let deleteButton = (this.props.post.authorUsername === currentUser.username || this.props.post.receiverUsername === currentUser.username || currentUser.role > 0) ?
            (<a className="cursor-pointer pull-right" onClick={this.handleDelete}>x</a>) : '';
        let editButton = (this.props.post.authorUsername === currentUser.username || currentUser.role > 0) ?
            (<a className="cursor-pointer pull-right" onClick={this.triggerEditMode}>Edit</a>) : '';
        let cancelButton = (<a className="cursor-pointer pull-right" onClick={this.triggerEditMode} >Cancel</a>);
        let submitButton = (<a className="cursor-pointer pull-right" onClick={this.onPostUpdate} >Submit</a>);

        if(this.state.editMode){
            return (
                <div>
                    <h3 className="postAuthor">
                        <Link to={authorLink}> {this.props.post.authorUsername}</Link>
                        {link ? '->' : ''}
                        {link ? link : ''}:
                    </h3>
                    {cancelButton}
                    {submitButton}
                    <input onChange={this.handleTextChange} type="text" value={this.state.text}/>
                    <h5>{this.props.post.date_created}</h5>
                </div>
            );
        }

        return (
            <div>
                <h3 className="postAuthor">
                    <Link to={authorLink}> {this.props.post.authorUsername}</Link>
                    {link ? '->' : ''}
                    {link ? link : ''}:
                </h3>
                {editButton}
                {deleteButton}
                <span dangerouslySetInnerHTML={getMarkDown(this.state.text)}/>
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
    onPostDelete: React.PropTypes.func,
    onPostUpdate: React.PropTypes.func
};
Post.contextTypes = {
    authServices: React.PropTypes.object
};