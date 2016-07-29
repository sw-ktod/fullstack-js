import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import UserComponent from '../components/user/user-component';
import AuthenticationComponent from "../components/auth/authentication-component";
import PostComponent from "../components/post/post-component";

import UserServices from '../services/user-services';
import AuthenticationServices from "../services/authentication-services";
import PostServices from "../services/post-services";
import CommentServices from "../services/comment-services";

import ErrorHandler from "../common/error-handler";

import NavComponent from "../components/navigation/navigation-component";

const AUTH_SERVICE_URL = '/api/auth';
const USER_SERVICE_URL = '/api/users';
const POST_SERVICE_URL = 'api/posts';
const COMMENT_SERVICE_URL = 'api/comments';

const routes = ()=> {
    return (
        <Router history={browserHistory}>
            <Route component={App}>
                <Route path="/" component={PostComponent}/>
                <Route path="auth" component={AuthenticationComponent}/>
                <Route path="users(/:username)(/:mode)" component={UserComponent}/>
            </Route>
        </Router>
    );
};

class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.authServices = new AuthenticationServices(AUTH_SERVICE_URL);
        this.userServices = new UserServices(USER_SERVICE_URL);
        this.postServices = new PostServices(POST_SERVICE_URL);
        this.commentServices = new CommentServices(COMMENT_SERVICE_URL);
        this.errorHandler = new ErrorHandler(this.authServices, this.context.router)
    }

    getChildContext() {
        return {
            authServices: this.authServices,
            userServices: this.userServices,
            postServices: this.postServices,
            commentServices: this.commentServices,
            errorHandler: this.errorHandler
        };
    }

    render() {
        return (
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

    componentDidMount() {
        if (!this.authServices.isAuthenticated()) {
            browserHistory.push('/auth');
        }
    }
}
App.propTypes = {
    children: React.PropTypes.node
};
App.contextTypes = {
    router: React.PropTypes.object
};
App.childContextTypes = {
    authServices: React.PropTypes.object,
    userServices: React.PropTypes.object,
    postServices: React.PropTypes.object,
    commentServices: React.PropTypes.object,
    errorHandler: React.PropTypes.object
};

ReactDOM.render(routes(), document.getElementById('app'))

