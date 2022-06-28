package com.cts.restfulwebservices.feign;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;



@FeignClient(value = "FeignCommunicator", url = "http://localhost:8081")
public interface Receiver {
	
	@GetMapping("/jpa/{user}/following")
	public ResponseEntity<List<String>> getAllFollow(@PathVariable("user") String user);

	@PutMapping("/jpa/user/{user}/followuser/{username}")
	public ResponseEntity<String> addFollow(@PathVariable("user") String user,
			@PathVariable("username") String username);
	
	@PutMapping("/jpa/user/{user}/unfollowuser/{username}")
	public ResponseEntity<String> removeFollow(@PathVariable("user") String user,
			@PathVariable("username") String username);
}
