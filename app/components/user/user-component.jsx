'use strict';

import React from "react";
import UserList from "./user-list";
import UserPage from "./user-page";
import errorHandler from "../error-handler";

export default class UserComponent extends React.Component{
    constructor(props, context){
        super(props, context);
        this.state = {
            data: [],
            user: undefined,
            posts: [],
            comments: [],
            editMode: false
        };
        this.handlePostSubmit = this.handlePostSubmit.bind(this);
        this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
        this.handleCommentDelete = this.handleCommentDelete.bind(this);
        this.handlePostDelete = this.handlePostDelete.bind(this);
        this.handleUserEdit = this.handleUserEdit.bind(this);
        this.setEditMode = this.setEditMode.bind(this);
        this.populatePage = this.populatePage.bind(this);

    }
    render() {
        if(this.state.user){
            return (
                <div>
                    <UserPage editMode={this.state.editMode} user={this.state.user}
                        posts={this.state.posts} comments={this.state.comments}
                        handlePostSubmit={this.handlePostSubmit}
                        handleCommentSubmit={this.handleCommentSubmit}
                        handleCommentDelete={this.handleCommentDelete}
                        handlePostDelete={this.handlePostDelete}
                        handleUserEdit={this.handleUserEdit} />
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
    handleUserEdit(user){
        this.context.userServices.editUser(user)
            .then((result)=>{
                console.log(result);
            }, (err)=>{
                errorHandler(err.status, err.statusText, this.context.authServices, this.context.router);
            })
    }

    handlePostSubmit(post){
        this.context.postServices.submitPost(post)
            .then((result) => {
                let postArray = this.state.posts;
                postArray.push(result);
                postArray = postArray.sort((aPost, bPost)=>{
                    return Date.parse(aPost.date_created) < Date.parse(bPost.date_created);
                });
                this.setState({posts: postArray})
            }, (err)=>{
                errorHandler(err.status, err.statusText, this.context.authServices, this.context.router);
            });
    }
    handleCommentSubmit(comment){
        this.context.commentServices.submitComment(comment)
            .then((result) => {
                let commentsArray = this.state.comments;
                commentsArray.push(result);
                this.setState({comments: commentsArray})
            }, (err)=>{
                errorHandler(err.status, err.statusText, this.context.authServices, this.context.router);
            });
    }

    handleCommentDelete(commentId){
        this.context.commentServices.deleteComment(commentId)
            .then(()=>{
                let comments = this.state.comments.filter((comment)=>{
                    return comment.id !== commentId;
                });
                this.setState({comments: comments})
            }, (err)=>{
                errorHandler(err.status, err.statusText, this.context.authServices, this.context.router);
            });
    }
    handlePostDelete(postId){
        this.context.postServices.removePost(postId)
            .then(()=>{
                let postArray = this.state.posts.filter((post)=>{
                    return post.id !== postId;
                });
                this.setState({posts:postArray});
            }, (err)=>{
                errorHandler(err.status, err.statusText, this.context.authServices, this.context.router);
            })
    }
    setEditMode(editModeState){
        this.setState({editMode:editModeState});
        this.forceUpdate();
    }

    populatePage(params){
        /**
         * User page
         */
        if(params.username){
            this.context.userServices.getUserByUsername(params.username)
                .then((response)=>{
                    this.setState({user:response});

                    /**
                     * Continueing after we've had the user object
                     */
                    if(params.edit && (this.state.user.id === this.context.authServices.getStoredData('user').account.id)){
                        /**
                         * Edit mode
                         */
                        this.setEditMode(true);
                    }else{
                        this.setEditMode(false);
                        this.context.postServices.getUserRelatedPosts(params.username)
                            .then((response)=>{
                                let dataArray = response.sort((aPost, bPost)=>{
                                    return Date.parse(aPost.date_created) < Date.parse(bPost.date_created);
                                });
                                this.setState({posts: dataArray})
                            }, (err)=>{
                                errorHandler(err.status, err.statusText, this.context.authServices, this.context.router);
                        });
                        this.context.commentServices.getComments()
                            .then((response)=>{
                                this.setState({comments:response});
                            }, (err)=>{
                                errorHandler(err.status, err.statusText, this.context.authServices, this.context.router);
                        });
                    }
                }, (err)=>{
                    errorHandler(err.status, err.statusText, this.context.authServices, this.context.router);
                });
        }
        else{
            /**
             * User list
             */
            this.context.userServices.getUsers()
                .then((response)=>{
                    this.setState({data:response});
                }, (err)=>{
                    errorHandler(err.status, err.statusText, this.context.authServices, this.context.router);
                })
        }
    }


    componentDidMount(){
        if(!this.context.authServices.isAuthenticated()) {
            this.context.router.push('/auth');
        }
        else{
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

};