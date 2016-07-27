'use strict';
import $ from "jquery";
import errorHandler from "../error-handler";

export default class PostServices{

    constructor(baseUrl){
        this.url = baseUrl;
    }
    submitPost(post){
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
}

