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
            posts: [{"id":29,"username":"FirstLast","description":"sdedef","targetDate":"2022-07-09T20:58:47.000+0000","comments":[{"username":"FirstLast","description":"cdcdvf","targetDate":"2022-07-09T20:58:56.000+0000"},{"username":"FirstLast2","description":"jjjjj","targetDate":"2022-07-09T21:35:04.000+0000"},{"username":"FirstLast2","description":"nice","targetDate":"2022-07-16T17:22:08.000+0000"}],"likes":[{"id":0,"idOfPost":29,"liker":"FirstLast9"},{"id":0,"idOfPost":29,"liker":"FirstLast2"}],"done":false,"postImage":null},{"id":34,"username":"FirstLast3","description":null,"targetDate":"2022-07-09T21:36:17.000+0000","comments":[],"likes":[],"done":false,"postImage":"http://localhost:8082/post/picpost/SunJul1003:06:16IST2022"},{"id":35,"username":"FirstLast2","description":"sjsjsjjjsssjsjjjjskkkkkkkkkkkkkssssshhhhh","targetDate":"2022-07-09T21:37:25.000+0000","comments":[{"username":"FirstLast","description":"ssssss","targetDate":"2022-07-09T21:39:36.000+0000"}],"likes":[{"id":0,"idOfPost":35,"liker":"FirstLast"}],"done":false,"postImage":null},{"id":36,"username":"FirstLast2","description":null,"targetDate":"2022-07-10T19:10:36.000+0000","comments":[{"username":"FirstLast","description":"","targetDate":"2022-07-17T16:53:52.000+0000"}],"likes":[{"id":0,"idOfPost":36,"liker":"FirstLast"}],"done":false,"postImage":"http://localhost:8082/post/picpost/MonJul1100:40:36IST2022"},{"id":37,"username":"FirstLast2","description":"hello testing","targetDate":"2022-07-10T19:13:13.000+0000","comments":[],"likes":[{"id":0,"idOfPost":37,"liker":"FirstLast2"},{"id":0,"idOfPost":37,"liker":"FirstLast"}],"done":false,"postImage":null},{"id":38,"username":"FirstLast9","description":"hcjhsc","targetDate":"2022-07-11T13:44:54.000+0000","comments":[],"likes":[],"done":false,"postImage":null},{"id":39,"username":"FirstLast12","description":"sghasc","targetDate":"2022-07-11T14:11:47.000+0000","comments":[],"likes":[{"id":0,"idOfPost":39,"liker":"FirstLast12"},{"id":0,"idOfPost":39,"liker":"FirstLast"}],"done":false,"postImage":null},{"id":40,"username":"FirstLast","description":null,"targetDate":"2022-07-16T17:23:34.000+0000","comments":[{"username":"FirstLast9","description":"nice","targetDate":"2022-07-16T17:23:59.000+0000"}],"likes":[{"id":0,"idOfPost":40,"liker":"FirstLast"}],"done":false,"postImage":"http://localhost:8082/post/picpost/SatJul1622:53:33IST2022"},{"id":42,"username":"FirstLast","description":"fineer","targetDate":"2022-07-16T17:42:37.000+0000","comments":[{"username":"FirstLast9","description":"how?","targetDate":"2022-07-16T17:42:55.000+0000"},{"username":"FirstLast","description":"ill not tell","targetDate":"2022-07-16T17:43:14.000+0000"}],"likes":[{"id":0,"idOfPost":42,"liker":"FirstLast"}],"done":false,"postImage":null},{"id":43,"username":"FirstLast9","description":null,"targetDate":"2022-07-16T17:43:27.000+0000","comments":[{"username":"FirstLast","description":"nice","targetDate":"2022-07-16T18:24:10.000+0000"}],"likes":[{"id":0,"idOfPost":43,"liker":"FirstLast"}],"done":false,"postImage":"http://localhost:8082/post/picpost/SatJul1623:13:27IST2022"},{"id":44,"username":"FirstLast2","description":"fffffff","targetDate":"2022-07-20T08:00:44.000+0000","comments":[],"likes":[],"done":false,"postImage":null}],
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
                {[{"id":29,"username":"FirstLast","description":"sdedef","targetDate":"2022-07-09T20:58:47.000+0000","comments":[{"username":"FirstLast","description":"cdcdvf","targetDate":"2022-07-09T20:58:56.000+0000"},{"username":"FirstLast2","description":"jjjjj","targetDate":"2022-07-09T21:35:04.000+0000"},{"username":"FirstLast2","description":"nice","targetDate":"2022-07-16T17:22:08.000+0000"}],"likes":[{"id":0,"idOfPost":29,"liker":"FirstLast9"},{"id":0,"idOfPost":29,"liker":"FirstLast2"}],"done":false,"postImage":null},{"id":34,"username":"FirstLast3","description":null,"targetDate":"2022-07-09T21:36:17.000+0000","comments":[],"likes":[],"done":false,"postImage":"http://localhost:8082/post/picpost/SunJul1003:06:16IST2022"},{"id":35,"username":"FirstLast2","description":"sjsjsjjjsssjsjjjjskkkkkkkkkkkkkssssshhhhh","targetDate":"2022-07-09T21:37:25.000+0000","comments":[{"username":"FirstLast","description":"ssssss","targetDate":"2022-07-09T21:39:36.000+0000"}],"likes":[{"id":0,"idOfPost":35,"liker":"FirstLast"}],"done":false,"postImage":null},{"id":36,"username":"FirstLast2","description":null,"targetDate":"2022-07-10T19:10:36.000+0000","comments":[{"username":"FirstLast","description":"","targetDate":"2022-07-17T16:53:52.000+0000"}],"likes":[{"id":0,"idOfPost":36,"liker":"FirstLast"}],"done":false,"postImage":"http://localhost:8082/post/picpost/MonJul1100:40:36IST2022"},{"id":37,"username":"FirstLast2","description":"hello testing","targetDate":"2022-07-10T19:13:13.000+0000","comments":[],"likes":[{"id":0,"idOfPost":37,"liker":"FirstLast2"},{"id":0,"idOfPost":37,"liker":"FirstLast"}],"done":false,"postImage":null},{"id":38,"username":"FirstLast9","description":"hcjhsc","targetDate":"2022-07-11T13:44:54.000+0000","comments":[],"likes":[],"done":false,"postImage":null},{"id":39,"username":"FirstLast12","description":"sghasc","targetDate":"2022-07-11T14:11:47.000+0000","comments":[],"likes":[{"id":0,"idOfPost":39,"liker":"FirstLast12"},{"id":0,"idOfPost":39,"liker":"FirstLast"}],"done":false,"postImage":null},{"id":40,"username":"FirstLast","description":null,"targetDate":"2022-07-16T17:23:34.000+0000","comments":[{"username":"FirstLast9","description":"nice","targetDate":"2022-07-16T17:23:59.000+0000"}],"likes":[{"id":0,"idOfPost":40,"liker":"FirstLast"}],"done":false,"postImage":"http://localhost:8082/post/picpost/SatJul1622:53:33IST2022"},{"id":42,"username":"FirstLast","description":"fineer","targetDate":"2022-07-16T17:42:37.000+0000","comments":[{"username":"FirstLast9","description":"how?","targetDate":"2022-07-16T17:42:55.000+0000"},{"username":"FirstLast","description":"ill not tell","targetDate":"2022-07-16T17:43:14.000+0000"}],"likes":[{"id":0,"idOfPost":42,"liker":"FirstLast"}],"done":false,"postImage":null},{"id":43,"username":"FirstLast9","description":null,"targetDate":"2022-07-16T17:43:27.000+0000","comments":[{"username":"FirstLast","description":"nice","targetDate":"2022-07-16T18:24:10.000+0000"}],"likes":[{"id":0,"idOfPost":43,"liker":"FirstLast"}],"done":false,"postImage":"http://localhost:8082/post/picpost/SatJul1623:13:27IST2022"},{"id":44,"username":"FirstLast2","description":"fffffff","targetDate":"2022-07-20T08:00:44.000+0000","comments":[],"likes":[],"done":false,"postImage":null}].length > 0 ? <>
                {[{"id":29,"username":"FirstLast","description":"sdedef","targetDate":"2022-07-09T20:58:47.000+0000","comments":[{"username":"FirstLast","description":"cdcdvf","targetDate":"2022-07-09T20:58:56.000+0000"},{"username":"FirstLast2","description":"jjjjj","targetDate":"2022-07-09T21:35:04.000+0000"},{"username":"FirstLast2","description":"nice","targetDate":"2022-07-16T17:22:08.000+0000"}],"likes":[{"id":0,"idOfPost":29,"liker":"FirstLast9"},{"id":0,"idOfPost":29,"liker":"FirstLast2"}],"done":false,"postImage":null},{"id":34,"username":"FirstLast3","description":null,"targetDate":"2022-07-09T21:36:17.000+0000","comments":[],"likes":[],"done":false,"postImage":"http://localhost:8082/post/picpost/SunJul1003:06:16IST2022"},{"id":35,"username":"FirstLast2","description":"sjsjsjjjsssjsjjjjskkkkkkkkkkkkkssssshhhhh","targetDate":"2022-07-09T21:37:25.000+0000","comments":[{"username":"FirstLast","description":"ssssss","targetDate":"2022-07-09T21:39:36.000+0000"}],"likes":[{"id":0,"idOfPost":35,"liker":"FirstLast"}],"done":false,"postImage":null},{"id":36,"username":"FirstLast2","description":null,"targetDate":"2022-07-10T19:10:36.000+0000","comments":[{"username":"FirstLast","description":"","targetDate":"2022-07-17T16:53:52.000+0000"}],"likes":[{"id":0,"idOfPost":36,"liker":"FirstLast"}],"done":false,"postImage":"http://localhost:8082/post/picpost/MonJul1100:40:36IST2022"},{"id":37,"username":"FirstLast2","description":"hello testing","targetDate":"2022-07-10T19:13:13.000+0000","comments":[],"likes":[{"id":0,"idOfPost":37,"liker":"FirstLast2"},{"id":0,"idOfPost":37,"liker":"FirstLast"}],"done":false,"postImage":null},{"id":38,"username":"FirstLast9","description":"hcjhsc","targetDate":"2022-07-11T13:44:54.000+0000","comments":[],"likes":[],"done":false,"postImage":null},{"id":39,"username":"FirstLast12","description":"sghasc","targetDate":"2022-07-11T14:11:47.000+0000","comments":[],"likes":[{"id":0,"idOfPost":39,"liker":"FirstLast12"},{"id":0,"idOfPost":39,"liker":"FirstLast"}],"done":false,"postImage":null},{"id":40,"username":"FirstLast","description":null,"targetDate":"2022-07-16T17:23:34.000+0000","comments":[{"username":"FirstLast9","description":"nice","targetDate":"2022-07-16T17:23:59.000+0000"}],"likes":[{"id":0,"idOfPost":40,"liker":"FirstLast"}],"done":false,"postImage":"http://localhost:8082/post/picpost/SatJul1622:53:33IST2022"},{"id":42,"username":"FirstLast","description":"fineer","targetDate":"2022-07-16T17:42:37.000+0000","comments":[{"username":"FirstLast9","description":"how?","targetDate":"2022-07-16T17:42:55.000+0000"},{"username":"FirstLast","description":"ill not tell","targetDate":"2022-07-16T17:43:14.000+0000"}],"likes":[{"id":0,"idOfPost":42,"liker":"FirstLast"}],"done":false,"postImage":null},{"id":43,"username":"FirstLast9","description":null,"targetDate":"2022-07-16T17:43:27.000+0000","comments":[{"username":"FirstLast","description":"nice","targetDate":"2022-07-16T18:24:10.000+0000"}],"likes":[{"id":0,"idOfPost":43,"liker":"FirstLast"}],"done":false,"postImage":"http://localhost:8082/post/picpost/SatJul1623:13:27IST2022"},{"id":44,"username":"FirstLast2","description":"fffffff","targetDate":"2022-07-20T08:00:44.000+0000","comments":[],"likes":[],"done":false,"postImage":null}].map(
                    (post,i) =>{
                        if(true)
                        return(
                        <PostCard key={post.id} post={post} ref={ref => this.refers[post.id] = ref} refreshFeed={this.retrieveAllTodos} deletePostClicked={this.deletePostClicked} username={post.username} stompClient={stompClient}/>
                    )})}
                </> : <Empty width={50 + "vw"} style={{maxWidth: 500}}/>}
            </div>
        )
    }

}


export default WelcomeComponent