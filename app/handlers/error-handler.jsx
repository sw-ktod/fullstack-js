import AuthServices from "./auth/authentication-component"
module.exports = (url, xhr, message) => {
    if(xhr.status === 401){
        AuthServices.validateAuthentication()
    }
    console.error(url, xhr.status, message);
}