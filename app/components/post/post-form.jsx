'use strict';

import React from "react";

export default class PostForm extends React.Component {
    constructor(props) {
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

        if (!text) {
            return;
        }
        let receiverUsername = this.props.receiverUsername || null;
        this.props.onPostSubmit({text: text, receiverUsername: receiverUsername});

        this.setState({
            text: ''
        });
    }

    render() {
        return (
            <form className="form container">
                <div className="col-md-1"></div>
                <input className="input-lg col-md-6" type="text" value={this.state.text}
                   placeholder="What's on your mind..."
                   onChange={this.handleTextChange}/>

                <div className="col-md-1"></div>
                <input className="col-md-3 btn btn-default btn-lg" type="submit" value="Post"
                   onClick={this.handleSubmit}/>

                <div className="col-md-1"></div>
                <br />
            </form>
        );
    }
}
PostForm.propTypes = {
    receiverUsername: React.PropTypes.string,
    onPostSubmit: React.PropTypes.func,
};