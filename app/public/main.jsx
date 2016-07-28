import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import UserComponent from '../handlers/user/user-component';
import AuthenticationComponent from "../handlers/auth/authentication-component";
import PostComponent from "../handlers/post/post-component";

import UserServices from '../handlers/user/user-services';
import AuthenticationServices from "../handlers/auth/authentication-services";
import PostServices from "../handlers/post/post-services";
import CommentServices from "../handlers/comment/comment-services";

import NavComponent from "../handlers/navigation/navigation-component";

const AUTH_SERVICE_URL = '/api/auth';
const USER_SERVICE_URL = '/api/users';
const POST_SERVICE_URL = 'api/posts';
const COMMENT_SERVICE_URL = 'api/comments';

const routes = ()=>{
    return (
        <Router history={browserHistory}>
            <Route component={App}>
                <Route path="/" component={PostComponent} />
                <Route path="auth" component={AuthenticationComponent} />
                <Route path="users(/:username)(/:edit)" component={UserComponent} />
        </Route>
        </Router>
    );
};

class App extends React.Component{
    constructor(props){
        super(props);
        this.authServices = new AuthenticationServices(AUTH_SERVICE_URL);
        this.userServices = new UserServices(USER_SERVICE_URL);
        this.postServices = new PostServices(POST_SERVICE_URL);
        this.commentServices = new CommentServices(COMMENT_SERVICE_URL);
    }
    getChildContext() {
        return {
            authServices: this.authServices,
            userServices: this.userServices,
            postServices: this.postServices,
            commentServices: this.commentServices
        };
    }
    render(){
        return(
            <div className="wrapper">
                <NavComponent/>
            <div>
            </div>
                <div className="container">
                    {this.props.children}
                </div>
            </div>
        );
    }
    componentDidMount(){
        if(!this.authServices.isAuthenticated()){
            browserHistory.push('/auth');
        }
    }
}
App.propTypes = {
    children: React.PropTypes.node
};
App.childContextTypes = {
    authServices: React.PropTypes.object,
    userServices: React.PropTypes.object,
    postServices: React.PropTypes.object,
    commentServices: React.PropTypes.object
};

ReactDOM.render(routes(), document.getElementById('app'))

