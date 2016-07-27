'use strict';

import $ from "jquery"
import errorHandler from "../error-handler";


export default class UserServices {
    constructor(baseUrl) {
        this.url = baseUrl;
    }
    //handlePostSubmit(post){
    //    let url = this.url + '/' + this.props.params.username + '/posts';
    //    $.ajax({
    //        method:'POST',
    //        url: url,
    //        dataType: 'json',
    //        cache: false,
    //        data: post
    //    }).done((data)=>{
    //        let dataArray = this.state.userPosts;
    //        dataArray.push(data);
    //        dataArray = dataArray.sort((aPost, bPost)=>{
    //            return aPost.date_created < bPost.date_created;
    //        });
    //        this.setState({userPosts: dataArray})
    //    }).fail((xhr,status,err)=>{
    //        errorHandler(url, xhr, err.toString())
    //    })
    //}
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
    //getUserRelatedPosts(username){
    //    let url = this.url + "/" + username + "/posts";
    //    $.ajax({
    //        method: 'GET',
    //        url: url,
    //        dataType: 'json',
    //        cache: false
    //    }).done((data)=>{
    //        let dataArray = data.sort((aPost, bPost)=>{
    //            return aPost.date_created < bPost.date_created;
    //        });
    //        this.setState({userPosts: dataArray})
    //    }).fail((xhr, status, err)=>{
    //        errorHandler(url, xhr, err.toString())
    //    })
    //}

    //getComments(){
    //    let url = '/api/comments';
    //    $.ajax({
    //        method: 'GET',
    //        url: url,
    //        dataType: 'json',
    //        cache: false
    //    }).done((data)=>{
    //        this.setState({comments: data})
    //    }).fail((xhr,status,err)=>{
    //        errorHandler(url, xhr, err.toString())
    //    })
    //}

    //handleCommentSubmit(comment){
    //    let url = '/api/posts/' + comment.postId + '/comments';
    //    console.log(this.props);
    //    $.ajax({
    //        method: 'POST',
    //        url: url,
    //        dataType: "json",
    //        data: comment,
    //        cache: false,
    //    }).done((data)=>{
    //        let dataArray = this.state.comments;
    //        dataArray.push(data);
    //        this.setState({data: dataArray})
    //    }).fail((xhr,status,err)=>{
    //        errorHandler(url, xhr, err.toString())
    //    })
    //}
}