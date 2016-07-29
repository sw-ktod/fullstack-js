import $ from "jquery";

export default class CommentServices {

    constructor(baseUrl) {
        this.url = baseUrl;
    }

    submitComment(comment) {
        let url = 'api/comments';
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
        let url = '/api/comments';
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

    deleteComment(commentId) {
        let url = '/api/comments/' + commentId;
        return new Promise((resolve, reject)=> {
            $.ajax({
                method: 'DELETE',
                url: url
            }).done(resolve)
                .fail(reject);
        });
    }

}

