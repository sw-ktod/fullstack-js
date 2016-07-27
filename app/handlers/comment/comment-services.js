'use strict';
import $ from "jquery";
import errorHandler from "../error-handler";

export default class CommentServices{

    constructor(baseUrl){
        this.url = baseUrl;
    }
    submitComment(comment){
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
    deleteComment(commentId){
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

}

