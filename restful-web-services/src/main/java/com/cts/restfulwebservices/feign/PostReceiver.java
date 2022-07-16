package com.cts.restfulwebservices.feign;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import com.cts.restfulwebservices.model.LikeDTO;
import com.cts.restfulwebservices.payload.UploadFileResponse;
import com.cts.restfulwebservices.post.Post;
import com.cts.restfulwebservices.post.PostComment;

@FeignClient(value = "PostFeignCommunicator", url = "http://localhost:8082")
public interface PostReceiver {

	@PostMapping(value = "/post/uploadPost/{username}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public UploadFileResponse fileUpload(@RequestPart(value = "file") MultipartFile file,
			@PathVariable String username);

	@GetMapping(value = "/post/picpost/{endpoint}")
	public ResponseEntity<Resource> downloadPostFile(@PathVariable String endpoint);

	@GetMapping(value = "/post/users/posts")
	public List<Post> getAll();

	@GetMapping("/post/users/{username}/posts")
	public List<Post> getAllUserPost(@PathVariable String username);

	@GetMapping("/post/users/{username}/posts/{id}")
	public Post getPost(@PathVariable String username, @PathVariable long id);

	@GetMapping("/post/users/{username}/posts/{id}/comments")
	public List<PostComment> getComments(@PathVariable String username, @PathVariable long id);

	@PostMapping(value = "/post/users/{username}/posts/{id}/comments")
	public ResponseEntity<Void> addComment(@PathVariable String username, @PathVariable long id,
			@RequestBody PostComment comment);

	@DeleteMapping("/post/users/{username}/posts/{id}")
	public ResponseEntity<Void> deletePost(@PathVariable String username, @PathVariable long id);

	@PutMapping("/post/users/{username}/posts/{id}")
	public ResponseEntity<Post> updatePost(@PathVariable String username, @PathVariable long id,
			@RequestBody Post post);
	
	@PostMapping("/post/users/{username}/posts")
	public ResponseEntity<Void> createPost(
			@PathVariable String username, @RequestBody Post post);
	
	@PostMapping("/post/like")
	public ResponseEntity<String> addLike(@RequestBody LikeDTO like);
	
	@PostMapping("/post/unlike")
	public ResponseEntity<String> unLike(@RequestBody LikeDTO like);
}
