package com.cts.restfulwebservices.controller;

import java.net.URI;
import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;


import org.apache.catalina.User;
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

import com.cts.restfulwebservices.model.Profile;
import com.cts.restfulwebservices.model.ProfileRepository;
import com.cts.restfulwebservices.repository.DAOUser;
import com.cts.restfulwebservices.repository.UserRepository;


@CrossOrigin(origins="http://localhost:4200")
@RestController

public class UserJpaResource {
    @Autowired
	private UserRepository userRepository;

    @Autowired
    private ProfileRepository profileRepository;
    
    @GetMapping("/jpa/users/")
	public List<DAOUser> getAllUser() {
		return userRepository.findAll();
	}
	
	@GetMapping("/jpa/users/{username}/profile")
	public List<DAOUser> getUser(@PathVariable String username){
		return userRepository.findByUsername(username);
		//return todoService.findAll();
	}
	
	@GetMapping("/jpa/users/{username}/profile/avatar")
	public String getAvatarLink(@PathVariable String username){
		return profileRepository.findByUsername(username).getAvatar();
		//return todoService.findAll();
	}
	
	@GetMapping("/jpa/users/{username}/profile/background")
	public String getBackgroundLink(@PathVariable String username){
		return profileRepository.findByUsername(username).getBackground();
		//return todoService.findAll();
	}
	
	
	@GetMapping("/jpa/users/{username}/profile/details")
	public Profile getProfileDetails(@PathVariable String username) {
		return profileRepository.findByUsername(username);
	}

	@GetMapping("/jpa/users/all/profile")
	public List<Profile> getAll(){
		return profileRepository.findAll();
	}
	
	//Show only following
	@GetMapping("/jpa/users/all/following")
	public List<Profile> getFolling(){
		return profileRepository.findAll();
	}

}