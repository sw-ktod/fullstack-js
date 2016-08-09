import sweetAlert from "sweetalert";

export default class ErrorHandler {
    constructor(auth, router) {
        this.auth = auth;
        this.router = router;
    }

    error(error) {
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
        sweetAlert(
            {
                title: error.responseJSON.error,
                text: error.responseJSON.message.replace(/\//g, ''),
                type: "error",
                confirmButtonText: "Ok"
            }
        );
    }

    success(message) {
        sweetAlert(
            {
                title: message,
                type: "success",
                confirmButtonText: "Ok"
            }
        );
    }

    warning(warningMessage, callback) {
        sweetAlert({
            title: "Are you sure?",
            text: warningMessage,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, continue!",
            cancelButtonText: "No, cancel plx!",
            closeOnConfirm: false,
            closeOnCancel: true
        }, callback);
    }


}