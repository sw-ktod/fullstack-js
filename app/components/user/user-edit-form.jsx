'use strict';

import React from "react";

export default class UserEditForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            dateOfBirth: '',
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleLastNameChange = this.handleLastNameChange.bind(this);
        this.handleDateOfBirthChange = this.handleDateOfBirthChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
    }

    handleFirstNameChange(e) {
        this.setState({firstName: e.target.value});
    }

    handleLastNameChange(e) {
        this.setState({lastName: e.target.value});
    }

    handleDateOfBirthChange(e) {
        this.setState({dateOfBirth: e.target.value});
    }

    handleEmailChange(e) {
        this.setState({email: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        let firstName = this.state.firstName.trim();
        let lastName = this.state.lastName.trim();
        let email = this.state.email.trim();
        let dateOfBirth = this.state.dateOfBirth.trim();

        this.props.handleUserEdit({username: this.props.user.username,firstName: firstName, lastName: lastName, email: email, dateOfBirth: dateOfBirth})

        this.setState({
            firstName: '',
            lastName: '',
            email: '',
            dateOfBirth: '',
        });
    }

    render() {
        return (
            <form className="col-md-6 text-center">
                <h2>Edit Profile</h2>

                <div className="form-group">
                    <label className="control-label" htmlFor="username">Username </label>
                    <input disabled className="input-sm form-control" type="text" value={this.props.user.username}
                           id="username"/>
                </div>
                <div className="form-group">
                    <label className="control-label" htmlFor="firstName">First name </label>
                    <input className="input-sm form-control" type="text" value={this.state.firstName}
                           id="firstName"
                           onChange={this.handleFirstNameChange}/>
                </div>
                <div className="form-group">
                    <label className="control-label" htmlFor="lastName">Last name </label>
                    <input className="input-sm form-control" type="text" value={this.state.lastName} id="lastName"
                           onChange={this.handleLastNameChange}/>
                </div>
                <div className="form-group">
                    <label className="control-label" htmlFor="email">Email </label>
                    <input className="input-sm form-control" type="text" value={this.state.email} id="email"
                           onChange={this.handleEmailChange}/>
                </div>
                <div className="form-group">
                    <label className="control-label" htmlFor="dateOfBirth">Date of birth </label>
                    <input className="input-sm form-control" type="date" value={this.state.dateOfBirth} id="dateOfBirth"
                           onChange={this.handleDateOfBirthChange}/>
                </div>

                <input className="input-sm form-control" type="submit" value="Save changes"
                       onClick={this.handleSubmit}/>
            </form>
        );
    }

    populate() {
        this.setState({
            firstName: this.props.user.firstName,
            lastName: this.props.user.lastName,
            email: this.props.user.email,
            dateOfBirth: this.props.user.dateOfBirth,
        })
    }

    componentDidMount() {
        this.populate();
    }
}
UserEditForm.propTypes = {
    user: React.PropTypes.shape({
        username: React.PropTypes.string.isRequired,
        firstName: React.PropTypes.string,
        lastName: React.PropTypes.string,
        email: React.PropTypes.string,
        dateOfBirth: React.PropTypes.string,
    }),
    handleUserEdit: React.PropTypes.func,
};