"use strict";

import React from "react";
//import getMarkDown from "../../common/markdown";
import UserEditForm from "./user-edit-form";
export default class User extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.props = props;
        this.state ={
            editMode: undefined,
            privileges: this.props.user.role
        };
        this.triggerEditMode = this.triggerEditMode.bind(this);
        this.onUserDelete = this.onUserDelete.bind(this);
        this.onUserUpdate = this.onUserUpdate.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);
        this.triggerEditMode = this.triggerEditMode.bind(this);
        this.triggerAdminPrivileges = this.triggerAdminPrivileges.bind(this);
    }

    render() {
        if(this.state.editMode){
            return (
                <UserEditForm user={this.props.user} handleUserEdit={this.onUserUpdate}>
                    <input type="submit" onClick={this.cancelEdit} value="Cancel" />
                </UserEditForm>
            )
        }else{
            let currentUser = this.context.authServices.getStoredData('user').account;
            let deleteButton = (currentUser.role > 0) ?
                (<a className="cursor-pointer pull-right" onClick={this.onUserDelete}>x</a>) : '';
            let editButton = (currentUser.role > 0) ?
                (<a className="cursor-pointer pull-right" onClick={this.triggerEditMode}>Edit</a>) : '';
            return (
                <div className="user col-md-3">
                    {editButton}
                    {deleteButton}
                    <h2 className="name">
                        {this.props.user.firstName} {this.props.user.lastName}
                    </h2>
                    ({this.props.user.username})
                </div>
            );
        }
    }
    cancelEdit(e){
        e.preventDefault();
        this.triggerEditMode();
    }
    triggerAdminPrivileges(){
        this.setState({privileges: !this.state.privileges})
    }
    triggerEditMode(){
        this.setState({editMode: !this.state.editMode});
    }
    onUserUpdate(user){
        this.props.handleUserEdit(user);
        this.triggerEditMode();
    }
    onUserDelete(e){
        e.preventDefault();
        if(!this.props.user.username){
            return;
        }
        this.props.handleUserDelete(this.props.user.username);
    }
}

User.propTypes = {
    user: React.PropTypes.shape({
        id: React.PropTypes.number.isRequired,
        username: React.PropTypes.string.isRequired,
        firstName: React.PropTypes.string,
        lastName: React.PropTypes.string,
        email: React.PropTypes.string,
        dateOfBirth: React.PropTypes.any,
        role: React.PropTypes.bool
    }),
    children: React.PropTypes.any,
    handleUserEdit: React.PropTypes.func,
    handleUserDelete: React.PropTypes.func,
};
User.contextTypes = {
    authServices: React.PropTypes.object,
};