module.exports = (status, message, auth, router) => {
    if(status === 401){
        auth.validateAuthentication()
            .then((response)=>{
                auth.storeData('user', response);
                router.push({pathname:'/'});
            }, (err)=>{
                if(err.status === 401){
                    auth.removeStoredData('user');
                    router.push({pathname:'/auth'});
                }
        })
    }
    console.log(status, message);
};