package com.cts.restfulwebservices.controller;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.cts.restfulwebservices.feign.PostReceiver;
import com.cts.restfulwebservices.model.LikeDTO;
import com.cts.restfulwebservices.post.Post;
import com.cts.restfulwebservices.post.PostComment;
import com.cts.restfulwebservices.post.PostJpaRepository;
import com.cts.restfulwebservices.repository.DAOUser;
import com.cts.restfulwebservices.repository.UserRepository;

@CrossOrigin(origins="http://localhost:4200")
@RestController
public class PostJpaResource {

	@Autowired
	private PostJpaRepository postJpaRepository;

	@Autowired
	private PostReceiver postReceiver;

	@GetMapping("/jpa/users/posts")
	public List<Post> getAll() {
//		return postJpaRepository.findAll();
		return postReceiver.getAll();
	}

	@GetMapping("/jpa/users/{username}/posts")
	public List<Post> getAllTodos(@PathVariable String username){
//		return postJpaRepository.findByUsername(username);
		return postReceiver.getAllUserPost(username);
	}

	@GetMapping("/jpa/users/{username}/posts/{id}")
	public Post getTodo(@PathVariable String username, @PathVariable long id){
//		return postJpaRepository.findById(id).get();
		return postReceiver.getPost(username, id);
	}

	@GetMapping("/jpa/users/{username}/posts/{id}/comments")
	public List<PostComment> getComments(@PathVariable String username, @PathVariable long id){
//		return postJpaRepository.findById(id).get().getComments();
		return postReceiver.getComments(username, id);
	}

	@PostMapping("/jpa/users/{username}/posts/{id}/comments")
	public ResponseEntity<Void> addComment(@PathVariable String username, @PathVariable long id, @RequestBody PostComment comment){

//		Post updatedPost = postJpaRepository.findById(id).get().addComment(comment);
//		updatedPost.setUsername(username);
//
//		postJpaRepository.save(updatedPost); // here lies the problem
		
		return postReceiver.addComment(username, id, comment);
//		return ResponseEntity.noContent().build();
	}

	@DeleteMapping("/jpa/users/{username}/posts/{id}")
	public ResponseEntity<Void> deleteTodo(@PathVariable String username, @PathVariable long id) {
//		postJpaRepository.deleteById(id);
//		return ResponseEntity.noContent().build();
		return postReceiver.deletePost(username, id);
	}
	

	@PutMapping("/jpa/users/{username}/posts/{id}")
	public ResponseEntity<Post> updateTodo(
			@PathVariable String username,
			@PathVariable long id, @RequestBody Post post){
		
//		post.setUsername(username);
//		post.setComments(postJpaRepository.findById(id).get().getComments());
//		Post postUpdated = postJpaRepository.save(post);
//		
//		return new ResponseEntity<Post>(post, HttpStatus.OK);
		
		return postReceiver.updatePost(username, id, post);
	}
	
	@PostMapping("/jpa/users/{username}/posts")
	public ResponseEntity<Void> createTodo(
			@PathVariable String username, @RequestBody Post post){
		
//		post.setUsername(username);
//
//		Post createdPost = postJpaRepository.save(post);
//
//		URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
//				.path("/{id}").buildAndExpand(createdPost.getId()).toUri();
//		
//		return ResponseEntity.created(uri).build();
		
		return postReceiver.createPost(username, post); 
	}
	
	/**
	*like API 
	*@author Punit
	*@param LikeDTO
	*@return {@link ResponseEntity}
	*/
	
	@PostMapping("/jpa/like")
	public ResponseEntity<String> addLike(@RequestBody LikeDTO like){
		
//		Post post= postJpaRepository.findById(like.getIdOfPost()).get();
//		List<LikeDTO> likes= post.getLikes();
//		int flag=0;
//		for(LikeDTO l: likes) {
//			if(l.getLiker().equals(like.getLiker()))
//			{
//				flag=1;
//			}
//		}
//		if(flag==0) {
//			post.addLikes(like);
//			postJpaRepository.save(post);
//			return ResponseEntity.ok("Like Added");
//		}
//		else {
//			return ResponseEntity.ok("Already Present");
//		}
		
		return postReceiver.addLike(like);
				
	}
	
	/**
	*unlike API 
	*@author Punit
	*@param LikeDTO
	*@return {@link ResponseEntity}
	*/
	
	@PostMapping("/jpa/unlike")
	public ResponseEntity<String> unLike(@RequestBody LikeDTO like){
		
//		Post post= postJpaRepository.findById(like.getIdOfPost()).get();
//		List<LikeDTO> likes= post.getLikes();
//		LikeDTO ld= null;
//		for(LikeDTO l: likes) {
//			if((l.getLiker().equals(like.getLiker()))&&(l.getIdOfPost()==like.getIdOfPost()))
//			{
//				ld= l;
//				break;
//			}
//		}
//		if(ld!=null) {
//			post.removeLikeObject(ld);
//			postJpaRepository.save(post);
//		}
//		
//		return ResponseEntity.ok("Done!");
		
		return postReceiver.unLike(like);
	}
	
}
