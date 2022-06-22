import React, {Component} from 'react';
import AuthenticationService from "../post/AuthenticationService";
import AccountProfileService from "../../api/main/AccountProfileService";
import {ReactComponent as Edit} from "./assets/wrench.svg"
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
class SideContentComponent extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            firstname: this.props.firstname,
            lastname: this.props.lastname,
            studentnumber: this.props.studentnumber,
            email: this.props.email,
            phonenumber: this.props.phonenumber,
            aboutme: this.props.aboutme,
            following:[],
            me: "",
            followButtonEnabled: true
        }
    }

    componentDidMount() {
        
        this.refreshInfo();
        console.log(this.state);
    }
    

    refreshInfo() {
        AccountProfileService.retrieveDetails(this.props.username)
            .then(response => {
                this.setState({
                    username: response.data.username,
                    firstname: response.data.firstname,
                    lastname: response.data.lastname,
                    studentnumber: response.data.studentnumber,
                    email:response.data.email,
                    phonenumber: response.data.phonenumber,
                    aboutme: response.data.aboutme,
                    followButtonEnabled: true
                });
                this.getFollowers();
            });

    }

    getFollowers=()=>{
        let user= AuthenticationService.getLoggedInUserName();
        AccountProfileService.getFollowingUsers(user)
        .then((response)=>{
            if(response.data.includes(this.state.username))
            {
                this.setState({followButtonEnabled: false})
            }
        })
    }

    followUser =()=>{
        let user= AuthenticationService.getLoggedInUserName();
        AccountProfileService.addFollowers(user,this.state.username)
        .then(() => {
            // alert("Followed ",this.state.username);
        });
        this.refreshInfo();
    }

    unFollowUser =()=>{
        let user= AuthenticationService.getLoggedInUserName();
        AccountProfileService.removeFollower(user,this.state.username)
        .then((response)=>{
            if(response.data==="SUCCESS")
            {
                this.setState({followButtonEnabled: true})
            }
        });
        // this.refreshInfo();
    }


    render(){
        return(
            <div className="col-lg-4 row-md">
                <div className="ui-block">
                    <div className="ui-title" style={{ display: "flex", minHeight: 61 + "px" }}>
                        <h5 style={{marginBottom: 0, textAlign: "center", position: "absolute", left: 50 + "%", transform: "translateX(" + -50 + "%)"}}>Contact Details</h5>{AuthenticationService.getLoggedInUserName() === this.props.username ?
                        <OverlayTrigger placement={"bottom"} overlay={<Tooltip id={"tooltip-bottom"}>Edit your information</Tooltip>}>
                            <Edit width={20} className="editUpdate" onClick={this.props.edit} style={{ marginLeft : "auto" }}/></OverlayTrigger> : ""}
                    </div>
                    <div className="ui-content">
                        <div className="personal-info">
                            <li><span className="title">Name</span>
                            <span className="text">{this.state.firstname} {this.state.lastname}</span></li>
                            <li><span className="title">About Me</span>
                            <span className="text">{this.state.aboutme}</span></li>
                            <li><span className="title">Student No.</span>
                            <span className="text">{this.state.studentnumber}</span></li>
                            <li><span className="title">Email</span>
                            <span className="text">{this.state.email}</span></li>
                        </div>
                        <br/><br/><br/>
                        {(AuthenticationService.getLoggedInUserName() != this.props.username)?
                        ((this.state.followButtonEnabled)?
                            <button type="button" class="btn btn-secondary" onClick={()=>this.followUser()}>Follow</button>:
                            <button type="button" class="btn btn-secondary" onClick={()=>this.unFollowUser()}>Unfollow</button>):""
                        }
                    </div>
                </div>
            </div>

        )
    }
}

export default SideContentComponent;