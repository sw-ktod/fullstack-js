'use strict';

import $ from "jquery"

export default class UserServices {
    constructor(baseUrl) {
        this.url = baseUrl;
    }

    getUsers() {
        let url = this.url;
        return new Promise((resolve, reject)=> {
            $.ajax({
                method: 'GET',
                url: url,
                dataType: "json",
                cache: false,
            }).done(resolve)
                .fail(reject);
        });
    }

    getUser(userId) {
        let url = this.url + "/" + userId;
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

    getUserByUsername(username) {
        let url = this.url + "/" + username;
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
    edit(username, data) {
        let url = this.url + '/' + username;
        return new Promise((resolve, reject)=> {
            $.ajax({
                method: 'PUT',
                url: url,
                dataType: 'json',
                data: data,
                cache: false
            }).done(resolve)
                .fail(reject);
        })
    }

    changePassword(data) {
        let url = 'api/auth/password';
        return new Promise((resolve, reject)=> {
            $.ajax({
                method: 'PUT',
                url: url,
                dataType: 'json',
                data: data,
                cache: false
            }).done(resolve)
                .fail(reject);
        });
    }

}