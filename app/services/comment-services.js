import $ from "jquery";

export default class CommentServices {

    constructor(baseUrl) {
        this.url = baseUrl;
    }

    submitComment(comment) {
        let url = this.url;
        return new Promise((resolve, reject)=> {
            $.ajax({
                method: 'POST',
                url: url,
                dataType: "json",
                data: comment,
                cache: false,
            }).done(resolve)
                .fail(reject);
        });
    }

    getComments() {
        let url = this.url;
        return new Promise((resolve, reject)=> {
            $.ajax({
                method: 'GET',
                url: url,
                dataType: 'json',
                cache: false
            }).done(resolve)
                .fail(reject);
        });
    }

    updateComment(comment){
        let url = this.url;
        return new Promise((resolve, reject)=>{
            $.ajax({
                method: 'PUT',
                url: url,
                dataType: 'json',
                cache: false,
                data: comment
            }).done(resolve)
                .fail(reject);
        });
    }

    deleteComment(commentId) {
        let url = this.url + `/${commentId}`;
        return new Promise((resolve, reject)=> {
            $.ajax({
                method: 'DELETE',
                url: url
            }).done(resolve)
                .fail(reject);
        });
    }

}

