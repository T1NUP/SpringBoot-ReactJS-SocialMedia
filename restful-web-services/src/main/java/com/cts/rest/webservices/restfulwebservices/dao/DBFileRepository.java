package com.cts.rest.webservices.restfulwebservices.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cts.rest.webservices.restfulwebservices.model.DBFile;

@Repository
public interface DBFileRepository extends JpaRepository<DBFile, String> {
    DBFile findByUsername(String username);
    DBFile findByFileURL(String url);
    DBFile deleteByFileURL(String url);
}
