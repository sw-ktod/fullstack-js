'use strict';
import PostForm from "./post-form";
import PostList from "./post-list";
import React from "react";

export default class PostComponent extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            posts: [],
            comments: []
        };
        this.handlePostSubmit = this.handlePostSubmit.bind(this);
        this.handlePostDelete = this.handlePostDelete.bind(this);
        this.getUserRelatedPosts = this.getUserRelatedPosts.bind(this);
    }

    render() {
        return (
            <div>
                <PostForm onPostSubmit={this.handlePostSubmit}/>
                <br />
                <PostList posts={this.state.posts} comments={this.state.comments}
                          handlePostDelete={this.handlePostDelete}/>
            </div>)
    }
    getUserRelatedPosts(username){
        this.context.postServices.getUserRelatedPosts(username)
            .then((response)=> {
                let dataArray = response.sort((aPost, bPost)=> {
                    return Date.parse(aPost.date_created) < Date.parse(bPost.date_created);
                });
                this.setState({posts: dataArray})
            }, (err)=> {
                this.context.errorHandler.alertError(err);
            });
        this.context.commentServices.getComments()
            .then((response)=> {
                this.setState({comments: response});
            }, (err)=> {
                this.context.errorHandler.alertError(err);
            });
    }
    handlePostSubmit(post) {
        let currentUser = this.context.authServices.getStoredData('user').account;
        let receiverUsername = this.props.username;
        if(receiverUsername && receiverUsername !== currentUser.username){
            post.receiverUsername = receiverUsername;
        }
        this.context.postServices.submitPost(post)
            .then((result) => {
                let postArray = this.state.posts;
                postArray.push(result);
                postArray = postArray.sort((aPost, bPost)=> {
                    return Date.parse(aPost.date_created) < Date.parse(bPost.date_created);
                });
                this.setState({posts: postArray})
            }, (err)=> {
                this.context.errorHandler.alertError(err);
            });
    }

    handlePostDelete(postId) {
        this.context.postServices.removePost(postId)
            .then(()=> {
                let postArray = this.state.posts.filter((post)=> {
                    return post.id !== postId;
                });
                this.setState({posts: postArray});
            }, (err)=> {
                this.context.errorHandler.alertError(err);
            })
    }

    componentDidMount() {
        if (this.context.authServices.isAuthenticated()) {
            if(this.props.username){
                this.getUserRelatedPosts(this.props.username);
            }else{
                this.context.postServices.getPosts()
                    .then((result)=> {
                        let dataArray = result.sort((aPost, bPost)=> {
                            return Date.parse(aPost.date_created) < Date.parse(bPost.date_created);
                        });
                        this.setState({posts: dataArray})
                    }, (err)=> {
                        this.context.errorHandler.alertError(err);
                    });
                this.context.commentServices.getComments().then((result)=> {
                    this.setState({comments: result})
                }, (err)=> {
                    this.context.errorHandler.alertError(err);
                });
            }
        } else {
            this.context.router.push({pathname: '/auth'});
        }
    }
}
PostComponent.propTypes = {
    username: React.PropTypes.string
};
PostComponent.contextTypes = {
    authServices: React.PropTypes.object,
    postServices: React.PropTypes.object,
    commentServices: React.PropTypes.object,
    router: React.PropTypes.object,
    errorHandler: React.PropTypes.object
};

