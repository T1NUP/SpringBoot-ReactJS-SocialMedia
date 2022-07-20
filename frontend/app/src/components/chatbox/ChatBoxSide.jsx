import React, { Component } from 'react';
import './chatbox.scss';
import ChatModule from './ChatModule';
import Socket from '../post/StartSocket';
import Avatar from "../post/Avatar";
import AccountProfileService from "../../api/main/AccountProfileService";

export const USER_NAME_SESSION_ATTRIBUTE_NAME = 'authenticatedUser'
var stompClient = null;
var sessionId = null;

export default class ChatBoxSide extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: sessionStorage.getItem(USER_NAME_SESSION_ATTRIBUTE_NAME),
            channelConnected: false,
            broadcastMessage: [],
            userList: [],
            receiver: [sessionStorage.getItem("user")], // Users who i'm chatting with
            following: []
        }
        this.connect();
    }

    connect = () => {
        stompClient = Socket.connect();
        stompClient.connect({}, this.onConnected, this.onError);
    }

    getUserList = () => {
        
      return this.state.userList;
    }

    getFollowing=()=>{
        console.log("USERNmae::",this.state.username);
        AccountProfileService.getFollowingUsers(this.state.username)
        .then(response => {

          if (response) {
            console.log("FETCHED:::",response);
            this.setState({following: [this.state.username,...response.data]});
          }

        })
        // this.setState({following: ["FirstLast2","FirstLast3"]});
    }

    onConnected = () => {

        this.setState({
          channelConnected: true
        })

        let url = stompClient.ws._transport.url;
        url = url.replace("ws://localhost:8080/ws",  "");
        url = url.replace("/websocket", "");
        url = url.replace(/^[0-9]+\//, "");

        sessionId = url;

        // Subscribing to the public topic
        stompClient.subscribe('/topic/public', this.onMessageReceived);
        stompClient.subscribe('/topic/getUser', this.onRefreshUserList);
        stompClient.subscribe('/queue/specific-user', (msg) => {
        });
        // Registering user to server
        stompClient.send("/app/addUser",
        {},
        JSON.stringify({ sender: this.state.username, type: 'JOIN' })
        )
        stompClient.send("/app/getUserlist", {}, this.state.username);


    }

    onError = (error) => {
       console.error(error);
    }

    onRefreshUserList = (payload) => {
        let users = JSON.parse(payload.body);
        console.log("WS Payload:::", payload);
        this.setState(prevState => ({
            userList: users
        }), );
        this.getFollowing();
    }

    sendMessage = (type, value, receiver) => {
        if (stompClient) {
            let chatMessage = {
              sender: this.state.username,
              content: type === 'TYPING' ? value : value,
              type: type,
              receiver: receiver  
            };
      
            stompClient.send("/app/sendMessage", {}, JSON.stringify(chatMessage));
      
            // clear message text box after sending the message
        }
    }

    onMessageReceived = (payload) => {
        let message = JSON.parse(payload.body);
        if (message.receiver == this.state.username && !this.state.receiver.includes(message.sender)) {
            this.setState(prevState => ({
                receiver: [...prevState.receiver, message.sender]
            }))
        }
        if (message.type === 'JOIN') {
         
        }
        else if (message.type === 'LEAVE') {     
            stompClient.send("/app/getUserlist", {}, this.state.username);
        }
        else if (message.type === 'TYPING') {
        }
        else if (message.type === 'CHAT') {
          this.state.broadcastMessage.push({
            message: message.content,
            sender: message.sender,
            dateTime: message.dateTime,
            receiver: message.receiver
          })
          this.setState({
            broadcastMessage: this.state.broadcastMessage,
          })
        }
        else {
          // do nothing...
        }
    }



    handleSelectUser = (user) => {
        // if(!user.includes(this.state.username) && !this.state.receiver.includes(user)) {
        if((!this.state.receiver.includes(user))) {
            this.setState(prevState => ({
                receiver: [...prevState.receiver, user]
            }))
        }
    }

    handleCloseUser = (remove) => {
        this.setState(prevState => ({
            receiver: prevState.receiver.filter(user => user !== remove)
        }))
    }
    render() {
        const components = [];
        for(var i = 0; i < this.state.receiver.length; i++) {
            console.log("Data:::",this.state.receiver[i])
            components.push(
            <ChatModule receiver={this.state.receiver[i]} broadcastMessage={this.state.broadcastMessage}
                handleCloseUser={this.handleCloseUser}
                sendMessage={this.sendMessage} username={this.state.username} key={i}/>
            );
        }
        return(
            <div>
                <div className="cbox-slide">
                    {
                    <div key={"indexes"} className="card user-holder" onClick={() => this.handleSelectUser("user")}>
                    <Avatar username={"user"} style={{float: 'left'}}/>
                    <div style={{float: 'left'}} className="chat-username">{this.state.username}</div>
                    </div>
                    
                    }
                </div>
                <div className="chatArea">
                    {components}
                </div>
            </div>);
    }
}
