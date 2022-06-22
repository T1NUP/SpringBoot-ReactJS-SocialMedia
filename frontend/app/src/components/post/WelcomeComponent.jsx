import React, { Component } from 'react'
import PostDataService from '../../api/main/PostDataService'
import AuthenticationService from './AuthenticationService';
import AccountProfileService from '../../api/main/AccountProfileService';
import { ReactComponent as Empty } from './assets/empty.svg';
import PostCard from './PostCard'
import PostComponent from './PostComponent';
import Socket from './StartSocket';
import moment from 'moment';


let stompClient = null;

class WelcomeComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            posts: [],
            followingAndMe: []
        }
        this.refers = [];
    }

    componentDidMount() {
        this.getFollowers();
        this.retrieveAllTodos();
        stompClient = Socket.connect();
        stompClient.connect({}, this.onConnected, this.onError);
        window.scrollTo(0, 0);
    }

    onConnected = () => {
        stompClient.subscribe("/topic/status", this.retrieveAllTodos);
    }

    onError = (err) => {
        console.error(err);
    }

    getFollowers=()=>{
        let user= AuthenticationService.getLoggedInUserName();
        AccountProfileService.getFollowingUsers(user)
        .then((response)=>{
            if(response.data)
            {
                this.setState({followingAndMe: [...response.data,user]});
            }
        });
    }

    retrieveAllTodos = (payload) => {
        PostDataService.retrieveAll().then(response => {
            this.setState({
                posts: response.data.sort(function(a,b) {
                    return moment.utc(a.targetDate).diff(moment.utc(b.targetDate));
                }).reverse()
            })
        });
        this.refers.forEach(refer => {
            if(refer)
                refer.refreshComments()
        });
    }

    deletePostClicked = (id) => {
        let username = AuthenticationService.getLoggedInUserName();
        let that = this;
        PostDataService.deletePost(username, id)
            .then(response => {
                    that.retrieveAllTodos();
                    stompClient.send("/app/postStatus", {}, true);
                }
            );
    }   


    render() {
        return (
            <div className="generalTodo">
                <PostComponent refreshFeed={this.retrieveAllTodos} username={AuthenticationService.getLoggedInUserName()} stompClient={stompClient}/>
                {this.state.posts.length > 0 ? <>
                {this.state.posts.map(
                    (post,i) =>{
                        if(this.state.followingAndMe.includes(post.username))
                        return(
                        <PostCard key={post.id} post={post} ref={ref => this.refers[post.id] = ref} refreshFeed={this.retrieveAllTodos} deletePostClicked={this.deletePostClicked} username={post.username} stompClient={stompClient}/>
                    )})}
                </> : <Empty width={50 + "vw"} style={{maxWidth: 500}}/>}
            </div>
        )
    }

}


export default WelcomeComponent