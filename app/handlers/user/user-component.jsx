'use strict';

import React from "react";
import UserList from "./user-list";
import UserPage from "./user-page";
import $ from "jquery"
import errorHandler from "../error-handler";
import AuthService from "../auth/authentication-component";
import { browserHistory } from 'react-router';


export default class UserComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data: [],
            user: undefined,
            userPosts: [],
            comments: []
        };
        this.url = '/api/users';

        this.getUsers = this.getUsers.bind(this);
        this.getUser = this.getUser.bind(this);
        this.getUserByUsername = this.getUserByUsername.bind(this);
        this.getUserRelatedPosts = this.getUserRelatedPosts.bind(this);
        this.handlePostSubmit = this.handlePostSubmit.bind(this);
        this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
        this.handleCommentDelete = this.handleCommentDelete.bind(this);
    }
    render() {
        if(this.state.user){
            return (
                <div>
                    <UserPage user={this.state.user}
                        posts={this.state.userPosts} comments={this.state.comments}
                        handlePostSubmit={this.handlePostSubmit}
                        handleCommentSubmit={this.handleCommentSubmit}
                        handleCommentDelete={this.handleCommentDelete}/>
                </div>
            );
    }
return (
    <div>
    <h2>Users:</h2>
<UserList data={this.state.data}/>
</div>
)
}
handleCommentDelete(commentId){
    let url = '/api/comments/' + commentId;
    $.ajax({
        method: 'DELETE',
        url: url
    }).done(()=>{
        let comments = this.state.comments.filter((comment)=>{
            return comment.id !== commentId;
        });
        this.setState({comments: comments})
    }).fail((xhr,status,err)=>{
        errorHandler(url, xhr, err.toString())
    })
}
handlePostSubmit(post){
    let url = this.url + '/' + this.props.params.username + '/posts';
    $.ajax({
        method:'POST',
        url: url,
        dataType: 'json',
        cache: false,
        data: post
    }).done((data)=>{
        let dataArray = this.state.userPosts;
        dataArray.push(data);
        dataArray = dataArray.sort((aPost, bPost)=>{
            return aPost.date_created < bPost.date_created;
        });
        this.setState({userPosts: dataArray})
    }).fail((xhr,status,err)=>{
        errorHandler(url, xhr, err.toString())
    })
}
getUsers() {
    let url = this.url;
    $.ajax({
        method: 'GET',
        url: url,
        dataType: "json",
        cache: false,
    }).done((data)=>{
        this.setState({data: data});
    }).fail((xhr,status,err)=>{
        errorHandler(url, xhr, err.toString())
    })
}
getUser(userId){
    let url = this.url + "/" + userId;
    $.ajax({
        method: 'GET',
        url: url,
        dataType: 'json',
        cache: false
    }).done((data)=>{
        this.setState({user: data})
    }).fail((xhr, status, err)=>{
        errorHandler(url, xhr, err.toString())
    })
}
getUserByUsername(username){
    let url = this.url + "/" + username;
    $.ajax({
        method: 'GET',
        url: url,
        dataType: 'json',
        cache: false
    }).done((data)=>{
        this.setState({user: data});
    }).fail((xhr, status, err)=>{
        errorHandler(url, xhr, err.toString())
    })
}
getUserRelatedPosts(username){
    let url = this.url + "/" + username + "/posts";
    $.ajax({
        method: 'GET',
        url: url,
        dataType: 'json',
        cache: false
    }).done((data)=>{
        let dataArray = data.sort((aPost, bPost)=>{
            return aPost.date_created < bPost.date_created;
        });
        this.setState({userPosts: dataArray})
    }).fail((xhr, status, err)=>{
        errorHandler(url, xhr, err.toString())
    })
}
getComments(){
    let url = '/api/comments';
    $.ajax({
        method: 'GET',
        url: url,
        dataType: 'json',
        cache: false
    }).done((data)=>{
        this.setState({comments: data})
    }).fail((xhr,status,err)=>{
        errorHandler(url, xhr, err.toString())
    })
}
handleCommentSubmit(comment){
    let url = '/api/posts/' + comment.postId + '/comments';
    $.ajax({
        method: 'POST',
        url: url,
        dataType: "json",
        data: comment,
        cache: false,
    }).done((data)=>{
        let dataArray = this.state.comments;
        dataArray.push(data);
        this.setState({data: dataArray})
    }).fail((xhr,status,err)=>{
        errorHandler(url, xhr, err.toString())
    })
}
componentDidMount(){
    if(!AuthService.isAuthenticated()) {
        browserHistory.push('/auth');
    }else{
        if(this.props.params.username){
            this.getUserByUsername(this.props.params.username);
            this.getUserRelatedPosts(this.props.params.username);
            this.getComments();
        }else{
            this.getUsers();
        }
    }
}
componentWillReceiveProps(nextProps) {
    if(nextProps.params.username){
        if(!this.state.user){
            this.getUserByUsername(nextProps.params.username);
            this.getUserRelatedPosts(nextProps.params.username);
            this.getComments();
        }else{
            if(this.state.user.username !== nextProps.params.username){
                this.getUserByUsername(nextProps.params.username);
                this.getUserRelatedPosts(nextProps.params.username);
                this.getComments();
            }
        }
    }else{
        this.setState({user: undefined});
        this.getUsers();
    }
}
}
UserComponent.propTypes = {
    params: React.PropTypes.any
};