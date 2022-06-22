package com.cts.restfulwebservices.model;

import javax.persistence.Column;

public class FollowDTO {

	private String username;
	private String following;
	
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getFollowing() {
		return following;
	}
	public void setFollowing(String following) {
		this.following = following;
	}
	
}
