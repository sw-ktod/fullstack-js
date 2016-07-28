import $ from "jquery";

export default class AuthenticationServices{
    constructor(baseUrl){
        this.url = baseUrl;
    }
    storeData(key, value){
        localStorage.setItem(key, JSON.stringify(value));
    }
    removeStoredData(key){
        localStorage.removeItem(key);
    }
    getStoredData(key){
        return JSON.parse(localStorage[key]);
    }
    isAuthenticated() {
        return (localStorage.hasOwnProperty('user'));
    }
    validateAuthentication() {
        let url = 'api/auth';
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "GET",
                url: url,
                cache: false
            }).done(resolve)
                .fail(reject);
        });
        //.done((user)=> {
        //    if(!user){
        //        localStorage.removeItem('user');
        //        browserHistory.push('/auth');
        //    }else{
        //        localStorage.setItem('user', JSON.stringify(user));
        //    }
        //}).fail((xhr, status, err)=> {
        //    errorHandler(url, xhr, err.toString());
        //});
    }

    handleUserLogout() {
        let url = this.url + "/logout";
        return new Promise((resolve, reject) => {
            $.ajax({
                method: "GET",
                url: url,
                cache: false
            }).done(resolve)
                .fail(reject);
        });
    }
    userRegister (user){
        let url = this.url + "/register";
        return new Promise((resolve, reject) => {
            $.ajax({
                method: 'POST',
                url: url,
                dataType: "json",
                data: user,
                cache: false,
            }).done(resolve)
                .fail(reject);
        });
    }
    userLogin (user){
        let url = this.url + "/login";
        return new Promise((resolve, reject) => {
            $.ajax({
                method: 'POST',
                url: url,
                dataType: "json",
                data: user,
                cache: false,
            }).done(resolve)
                .fail(reject);
        });
    }

}

