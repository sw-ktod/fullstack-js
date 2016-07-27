'use strict';

import React from "react";

export default class CommentForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            text: ''
        };
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleTextChange(e) {
        this.setState({text: e.target.value});
    }
    handleSubmit(e) {
        e.preventDefault();
        let text = this.state.text.trim();

        if(!text){
            return ;
        }
        this.props.onCommentSubmit({postId: this.props.postId, text: text});

        this.setState({
            text: ''
        });
    }

    render() {
        return (
            <form className="form">
                <input type="text" value={this.state.text} placeholder="Comment..."
                    onChange={this.handleTextChange} />
                <input type="submit" value="Post"
                    onClick={this.handleSubmit} />
            </form>
        );
    }
}
CommentForm.propTypes = {
    postId: React.PropTypes.number.isRequired,
    onCommentSubmit: React.PropTypes.func,
};