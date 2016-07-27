'use strict';
import PostForm from "./post-form";
import PostList from "./post-list";
import AuthService from "../auth/authentication-component";
import $ from "jquery";
import React from "react";
import { browserHistory } from 'react-router';
import errorHandler from "../error-handler";

export default class PostComponent extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            posts: [],
            comments: []
        };
        this.url = '/api/posts';
        this.handlePostSubmit = this.handlePostSubmit.bind(this);
        this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
        this.handleCommentDelete = this.handleCommentDelete.bind(this);
    }
    render() {
        return  (
            <div>
            <PostForm onPostSubmit={this.handlePostSubmit}/>
            <br />
                <PostList posts={this.state.posts} comments={this.state.comments} handleCommentSubmit={this.handleCommentSubmit} handleCommentDelete={this.handleCommentDelete}/>
            </div>)
}
handlePostSubmit(post){
    let url = this.url;
    $.ajax({
        method: 'POST',
        url: url,
        dataType: "json",
        data: post,
        cache: false,
    }).done((data)=>{
        let dataArray = this.state.posts;
        dataArray.push(data);
        dataArray = dataArray.sort((aPost, bPost)=>{
            return aPost.date_created < bPost.date_created;
        });
        this.setState({posts: dataArray})
    }).fail((xhr,status,err)=>{
        errorHandler(url, xhr, err.toString())
    })
}
handleCommentSubmit(comment){
    let url = this.url + '/' + comment.postId + '/comments';
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
getPostComments(postId){
    let url = this.url + '/' + postId + '/comments';
    $.ajax({
        method: 'GET',
        url: url,
        dataType: "json",
        cache: false,
    }).done((data)=>{
        this.setState({comments: data})
    }).fail((xhr,status,err)=>{
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
getPosts(){
    let url = this.url;
    $.ajax({
        method: 'GET',
        url: url,
        dataType: 'json',
        cache: false,
    }).done((data)=>{
        let postArray = data.sort((aPost, bPost)=>{
            return aPost.date_created < bPost.date_created;
        });
        this.setState({posts: postArray})
    }).fail((xhr,status,err)=>{
        errorHandler(url, xhr, err.toString())
    })
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
componentDidMount(){
    if(AuthService.isAuthenticated()){
        this.getPosts();
        this.getComments();
    }else{
        browserHistory.push('/auth');
    }
}
}
PostComponent.propTypes = {
    postId: React.PropTypes.number
};

