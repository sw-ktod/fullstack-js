'use strict';

import React from "react";

export default class PostForm extends React.Component{
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
        this.props.onPostSubmit({text: text});

        this.setState({
            text: ''
        });
    }

    render() {
        return (
            <form className="form">
                <input className="input-lg col-md-12" type="text" value={this.state.text} placeholder="What's on your mind..."
                    onChange={this.handleTextChange} />
                <input className="pull-right col-md-5 btn btn-default btn-md" type="submit" value="Post"
                    onClick={this.handleSubmit} />
            </form>
        );
    }
}
PostForm.propTypes = {
    receiverUsername: React.PropTypes.string,
    onPostSubmit: React.PropTypes.func,
};