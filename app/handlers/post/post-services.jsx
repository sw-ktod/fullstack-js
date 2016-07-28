'use strict';
import $ from "jquery";

export default class PostServices{

    constructor(baseUrl){
        this.url = baseUrl;
    }
    submitPost(post){
        let url = this.url;
        return new Promise((resolve, reject)=>{
            $.ajax({
                method: 'POST',
                url: url,
                dataType: "json",
                data: post,
                cache: false,
            }).done(resolve)
                .fail(reject);
        });
    }
    getUserRelatedPosts(username){
        let url = "/api/users/" + username + "/posts";
        return new Promise((resolve, reject)=>{
            $.ajax({
                method: 'GET',
                url: url,
                dataType: 'json',
                cache: false
            }).done(resolve)
                .fail(reject);
        });
    }
    getPosts(){
        let url = this.url;
        return new Promise((resolve, reject)=>{
            $.ajax({
                method: 'GET',
                url: url,
                dataType: 'json',
                cache: false,
            }).done(resolve)
                .fail(reject);
        });
    }
    editPost(post) {
        let url = this.url;
        return new Promise((resolve, reject)=> {
            $.ajax({
                method: 'PUT',
                url: url,
                data: post,
                dataType: 'json',
                cache: false,
            }).done(resolve)
                .fail(reject);
        });
    }
    removePost(postId) {
        let url = this.url + '/' + postId;
        return new Promise((resolve, reject)=>{
            $.ajax({
                method: 'DELETE',
                url: url
            }).done(resolve)
                .fail(reject);
        });
    }

}

