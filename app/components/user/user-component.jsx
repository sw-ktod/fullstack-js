'use strict';

import React from "react";
import UserList from "./user-list";
import UserPage from "./user-page";

export default class UserComponent extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            data: [],
            user: undefined,
            posts: [],
            comments: [],
            mode: 'default'
        };
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleUserEdit = this.handleUserEdit.bind(this);
        this.handleUserDelete = this.handleUserDelete.bind(this);
        this.populatePage = this.populatePage.bind(this);

    }

    render() {
        if (this.state.user) {
            return (
                <div>
                    <UserPage mode={this.state.mode} user={this.state.user}
                              posts={this.state.posts} comments={this.state.comments}
                              handleUserEdit={this.handleUserEdit}
                              handlePasswordChange={this.handlePasswordChange}
                              handleUserDelete={this.handleUserDelete}/>
                </div>
            );
        }
        /**
         * User list
         */
        return (
            <div>
                <h2>Users:</h2>
                <UserList data={this.state.data} handleUserEdit={this.handleUserEdit} handleUserDelete={this.handleUserDelete}/>
            </div>
        )
    }

    handlePasswordChange(data) {
        this.context.userServices.changePassword(data)
            .then((response)=> {
                this.context.responseHandler.success(response.message);
            }, (err)=> {
                this.context.responseHandler.error(err);
            });
    }

    handleUserEdit(data) {
        this.context.userServices.edit(data)
            .then((response)=> {
                let user = this.context.authServices.getStoredData('user').account;

                let editedUser = response.user;
                if(user.username === editedUser.username){
                    editedUser.id = user.id;
                    this.context.authServices.storeData('user', {account: editedUser});
                    this.setState({
                        user: editedUser,
                    });
                    this.context.router.push('/users/' + editedUser.username);
                }else{
                    this.context.router.push('/users');
                }
                this.context.responseHandler.success(response.message);
            }, (err)=> {
                this.context.responseHandler.error(err);
            });
    }

    handleUserDelete(userId) {
        this.context.responseHandler.warning('',
            (confirmed)=>{
                if(confirmed){
                    this.context.userServices.removeUser(userId)
                        .then((response)=> {
                            let users = this.state.data.filter((user)=>{
                                return user.id !== userId;
                            });
                            this.setState({data:users})
                            this.context.responseHandler.success(response.message);
                        }, (err)=> {
                            this.context.responseHandler.error(err);
                    })
                }
            })
    }

    populatePage(params) {
        /**
         * User page
         */
        this.setState({mode: params.mode || 'default', user: undefined});

        if (params.username) {
            this.context.userServices.getUserByUsername(params.username)
                .then((response)=> {
                    this.setState({user: response.user});
                    /**
                     * Continuing after we've had the user object
                     */
                    if (this.state.mode === 'default') {
                        this.context.postServices.getUserRelatedPosts(params.username)
                            .then((response)=> {
                                let dataArray = response.posts.sort((aPost, bPost)=> {
                                    return Date.parse(aPost.date_created) < Date.parse(bPost.date_created);
                                });
                                this.setState({posts: dataArray})
                            }, (err)=> {
                                this.context.responseHandler.error(err);
                            });
                        this.context.commentServices.getComments()
                            .then((response)=> {
                                this.setState({comments: response.comments});
                            }, (err)=> {
                                this.context.responseHandler.error(err);
                            });
                    }else{
                        let currentUser = this.context.authServices.getStoredData('user').account;
                        if(currentUser.username !== params.username && !currentUser.role){
                            this.setState({mode:'default'});
                        }
                    }
                }, (err)=> {
                    this.context.responseHandler.error(err);
                });
        }
        else {
            /**
             * User list
             */
            this.context.userServices.getUsers()
                .then((response)=> {
                    this.setState({
                        data: response.users,
                        user: undefined,
                        posts: [],
                        comments: [],
                        mode: 'default'
                    });
                }, (err)=> {
                    this.context.responseHandler.error(err);
                })
        }
    }


    componentDidMount() {
        if (!this.context.authServices.isAuthenticated()) {
            this.context.router.push('/auth');
        }
        else {
            this.populatePage(this.props.params);
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.params !== this.props.params){
            this.populatePage(nextProps.params);
        }
    }
}
UserComponent.propTypes = {
    params: React.PropTypes.any
};
UserComponent.contextTypes = {
    authServices: React.PropTypes.object,
    userServices: React.PropTypes.object,
    commentServices: React.PropTypes.object,
    postServices: React.PropTypes.object,
    router: React.PropTypes.object,
    responseHandler: React.PropTypes.object,
};