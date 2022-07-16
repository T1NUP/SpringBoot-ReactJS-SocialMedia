package com.cts.restfulwebservices.controller;

import com.cts.restfulwebservices.feign.PostReceiver;
import com.cts.restfulwebservices.model.DBFile;
import com.cts.restfulwebservices.model.Profile;
import com.cts.restfulwebservices.payload.UploadFileResponse;
import com.cts.restfulwebservices.post.Post;
import com.cts.restfulwebservices.post.PostJpaRepository;
import com.cts.restfulwebservices.repository.DBFileRepository;
import com.cts.restfulwebservices.service.DBFileStorageService;
import com.cts.restfulwebservices.service.JwtUserDetailsService;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@CrossOrigin(origins="http://localhost:4200")
@RestController
public class FileController {

    private static final Logger logger = LoggerFactory.getLogger(FileController.class);

    @Autowired
    private DBFileStorageService DBFileStorageService;

    @Autowired
    private DBFileRepository dbFileRepository;

    @Autowired
    JwtUserDetailsService jwtInMemoryUserDetailsService;
    
    @Autowired
	private PostJpaRepository postJpaRepository;
    
    @Autowired
    private PostReceiver postReceiver;

    
    @PostMapping("/jpa/uploadAvatar/{username}")
    public UploadFileResponse uploadAvatar( @PathVariable String username, @RequestBody MultipartFile file) {
    	
        DBFile dbFile = DBFileStorageService.storeFile(file);


        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/avatar/")
                .path(username)
                .toUriString();
        System.out.println("This user: " + username);
        System.out.println("File Avatar URL: " + fileDownloadUri);

        DBFile toDelete =  dbFileRepository.findByFileURL(fileDownloadUri);

        if(toDelete != null){
            dbFileRepository.deleteById(toDelete.getId());
        }

        dbFile.setFileURL(fileDownloadUri);

        dbFileRepository.save(dbFile);
        System.out.println(dbFile);


        Profile updated = jwtInMemoryUserDetailsService.assignAvatar(username, dbFile);


        return new UploadFileResponse(dbFile.getFileName(), fileDownloadUri,
                file.getContentType(), file.getSize());
    }
    
    /**
	*Upload post API 
	*@author Punit
	*@Note does Post entity upload with null description to be able to map url
	*/
    
    @PostMapping("/jpa/uploadPost/{username}")
    public UploadFileResponse uploadPost( @PathVariable String username, @RequestBody MultipartFile file) {
    	
//        DBFile dbFile = DBFileStorageService.storeFile(file);
//        
//        Date timeStamp= new Date();
//        
//        Post picPost= new Post();
//        picPost.setUsername(username);
//        picPost.setTargetDate(timeStamp);
//
//        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
//                .path("/picpost/")
//                .path(timeStamp.toString().replaceAll(" ", ""))
//                .toUriString();
//        System.out.println("This user: " + username);
//        System.out.println("File Pic URL: " + fileDownloadUri);
//
////        DBFile toDelete =  dbFileRepository.findByFileURL(fileDownloadUri);
////
////        if(toDelete != null){
////            dbFileRepository.deleteById(toDelete.getId());
////        }
//
//        dbFile.setFileURL(fileDownloadUri);
//
//        dbFileRepository.save(dbFile);
//        System.out.println(dbFile);
//
//
////        Profile updated = jwtInMemoryUserDetailsService.assignAvatar(username, dbFile);
//        picPost.setPostImage(dbFile.getFileURL());
//        postJpaRepository.save(picPost);
//
//
//        return new UploadFileResponse(dbFile.getFileName(), fileDownloadUri,
//                file.getContentType(), file.getSize());
    	
    	return postReceiver.fileUpload(file,username);
//    	return new UploadFileResponse("gg", "ername", "username", 0L);
    }
    
    /**
	*For sending src of image to ui
	*@author Punit
	*/
    
    @GetMapping("/picpost/{endpoint}")
    public ResponseEntity<Resource> downloadPostFile(@PathVariable String endpoint) {
        // Load file from database
//        DBFile dbFile = DBFileStorageService.getAvatarByProfile(username);
        
//        DBFile test = dbFileRepository.findByFileURL("http://localhost:8080/post/MonJun2722:21:41IST2022");
    	
    	
//    	DBFile file= DBFileStorageService.getPostImage(endpoint);
//
//        return ResponseEntity.ok()
//                .contentType(MediaType.parseMediaType(file.getFileType()))
//                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFileName() + "\"")
//                .body(new ByteArrayResource(file.getData()));
    	return postReceiver.downloadPostFile(endpoint);
    }
    
    @PostMapping("/jpa/uploadBackground/{username}")
    public UploadFileResponse uploadBackground( @PathVariable String username, @RequestBody MultipartFile file) {
    	
        DBFile dbFile = DBFileStorageService.storeFile(file);


        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/background/")
                .path(username)
                .toUriString();

        DBFile toDelete =  dbFileRepository.findByFileURL(fileDownloadUri);

        if(toDelete != null){
            dbFileRepository.deleteById(toDelete.getId());
        }

        dbFile.setFileURL(fileDownloadUri);
        dbFileRepository.save(dbFile);


        Profile updated = jwtInMemoryUserDetailsService.assignBackground(username, dbFile);


        return new UploadFileResponse(dbFile.getFileName(), fileDownloadUri,
                file.getContentType(), file.getSize());
    }

    

    /*
    @PostMapping("/uploadMultipleFiles")
    public List<UploadFileResponse> uploadMultipleFiles(@RequestParam("files") MultipartFile[] files, DBFileDTO username) {
        return Arrays.asList(files)
                .stream()
                .map(file -> uploadFile(file))
                .collect(Collectors.toList());
    }

     */
    
    @GetMapping("/avatar/{username}")
    public ResponseEntity<Resource> downloadAvatarFile(@PathVariable String username) {
        // Load file from database
        DBFile dbFile = DBFileStorageService.getAvatarByProfile(username);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(dbFile.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + dbFile.getFileName() + "\"")
                .body(new ByteArrayResource(dbFile.getData()));
    }
    
    @GetMapping("/background/{username}")
    public ResponseEntity<Resource> downloadBackgroundFile(@PathVariable String username) {
        // Load file from database
        DBFile dbFile = DBFileStorageService.getBackgroundByProfile(username);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(dbFile.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + dbFile.getFileName() + "\"")
                .body(new ByteArrayResource(dbFile.getData()));
    }
    
    @GetMapping("/downloadFile/{fileId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileId) {
        // Load file from database
        DBFile dbFile = DBFileStorageService.getFile(fileId);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(dbFile.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + dbFile.getFileName() + "\"")
                .body(new ByteArrayResource(dbFile.getData()));
    }

}
