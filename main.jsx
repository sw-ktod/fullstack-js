import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import UserComponent from './app/handlers/user/user-component';
import AuthServices from "./app/handlers/auth/authentication-component";
import PostComponent from "./app/handlers/post/post-component";
import NavComponent from "./app/handlers/navigation/navigation-component";

const routes = ()=>{
    return (
        <Router history={browserHistory}>
            <Route component={App}>
                <Route path="/" component={PostComponent} />
                <Route path="auth" component={AuthServices} />
                <Route path="users(/:username)" component={UserComponent} />
        </Route>
        </Router>
    );
}

class App extends React.Component{
    constructor(props){
        super(props);
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
    showNotification(){
        this.refs.notificator.success("title", "msg-body", 400)
    }
    componentDidMount(){
        if(!AuthServices.isAuthenticated()){
            browserHistory.push('/auth');
        }
    }
}
App.propTypes = {
    children: React.PropTypes.node
}

ReactDOM.render(routes(), document.getElementById('app'))

