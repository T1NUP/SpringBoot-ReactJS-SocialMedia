package com.cts.restfulwebservices.post;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import javax.persistence.*;

import com.cts.restfulwebservices.model.LikeDTO;

@Entity
@Table(name = "Todo")
public class Post {
	@Id
	@GeneratedValue
	private Long id;
	private String username;
	private String description;
	private Date targetDate;
	private String image;
	private boolean isDone;

	@ElementCollection(fetch = FetchType.LAZY)
	private List<PostComment> comments = new ArrayList<>();
	
	@ElementCollection(fetch = FetchType.LAZY)
	private List<LikeDTO> likes = new ArrayList<>();

	public Post() {

	}


	public Post(long id, String username, String description, Date targetDate, boolean isDone) {
		super();
		this.id = id;
		this.username = username;
		this.description = description;
		this.targetDate = targetDate;
		this.isDone = isDone;
		this.comments = new ArrayList<PostComment>();
		this.likes = new ArrayList<LikeDTO>();
	}
	
	public Post addLikes(LikeDTO like) {
		this.likes.add(like);
		return this;
	}
	
	public List<LikeDTO> getLikes(){
		return this.likes;
	}
	
	public void setNewLikes(List<LikeDTO> list) {
		this.likes.addAll(list);
	}
	
	public void removeLikeObject(LikeDTO like) {
		this.likes.remove(like);
	}
	
	public Post addComment(PostComment comment) {
		this.comments.add(comment);
		return this;
	}
	

	public String getPostImage() {
		return image;
	}


	public void setPostImage(String image) {
		this.image = image;
	}


	public List<PostComment> getComments() {
		return this.comments;
	}

	public void setComments(List<PostComment> list) {
		this.comments = list;
	}
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Date getTargetDate() {
		return targetDate;
	}

	public void setTargetDate(Date targetDate) {
		this.targetDate = targetDate;
	}

	public boolean isDone() {
		return isDone;
	}

	public void setDone(boolean isDone) {
		this.isDone = isDone;
	}

	public void printComments() {
		System.out.println("Print comments");
		System.out.println(Arrays.toString(comments.toArray()));
		System.out.println("Print first comment");
		System.out.println(comments.get(0).toString());
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + (int) (id ^ (id >>> 32));
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Post other = (Post) obj;
		if (id != other.id)
			return false;
		return true;
	}

	
}