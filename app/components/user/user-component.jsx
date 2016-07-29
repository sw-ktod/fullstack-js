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
        this.setMode = this.setMode.bind(this);
        this.populatePage = this.populatePage.bind(this);

    }

    render() {
        if (this.state.user) {
            return (
                <div>
                    <UserPage mode={this.state.mode} user={this.state.user}
                              posts={this.state.posts} comments={this.state.comments}
                              handleUserEdit={this.handleUserEdit}
                              handlePasswordChange={this.handlePasswordChange}/>
                </div>
            );
        }
        /**
         * User list
         */
        return (
            <div>
                <h2>Users:</h2>
                <UserList data={this.state.data}/>
            </div>
        )
    }

    handlePasswordChange(data) {
        this.context.userServices.changePassword(data)
            .then((result)=> {
                console.log(result);
            }, (err)=> {
                this.context.errorHandler.alertError(err);
            })
    }

    handleUserEdit(data) {
        this.context.userServices.edit(data)
            .then((result)=> {
                console.log(result);
            }, (err)=> {
                this.context.errorHandler.alertError(err);
            })
    }

    setMode(mode) {
        this.setState({mode: mode});
    }

    populatePage(params) {
        /**
         * User page
         */
        if (params.username) {
            this.context.userServices.getUserByUsername(params.username)
                .then((response)=> {
                    this.setState({user: response});

                    /**
                     * Continuing after we've had the user object
                     */
                    if (params.mode) {
                        this.setMode(params.mode);
                    } else {
                        this.setMode('default');
                        this.context.postServices.getUserRelatedPosts(params.username)
                            .then((response)=> {
                                let dataArray = response.sort((aPost, bPost)=> {
                                    return Date.parse(aPost.date_created) < Date.parse(bPost.date_created);
                                });
                                this.setState({posts: dataArray})
                            }, (err)=> {
                                this.context.errorHandler.alertError(err);
                            });
                        this.context.commentServices.getComments()
                            .then((response)=> {
                                this.setState({comments: response});
                            }, (err)=> {
                                this.context.errorHandler.alertError(err);
                            });
                    }
                }, (err)=> {
                    this.context.errorHandler.alertError(err);
                });
        }
        else {
            /**
             * User list
             */
            this.context.userServices.getUsers()
                .then((response)=> {
                    this.setState({
                        data: response,
                        user: undefined,
                        posts: [],
                        comments: [],
                        mode: 'default'
                    });
                }, (err)=> {
                    this.context.errorHandler.alertError(err);
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
        this.populatePage(nextProps.params);
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
    errorHandler: React.PropTypes.object,
};