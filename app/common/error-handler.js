export default class ErrorHandler {
    constructor(auth, router) {
        this.auth = auth;
        this.router = router;
    }

    alertError(error) {
        if (error.status === 401) {
            this.auth.validateAuthentication()
                .then((response)=> {
                    this.auth.storeData('user', response);
                    this.router.push({pathname: '/'});
                }, (err)=> {
                    if (err.status === 401) {
                        this.auth.removeStoredData('user');
                        this.router.push({pathname: '/auth'});
                    }
                });
        }
        alert(JSON.stringify(error.responseJSON));
    }
}