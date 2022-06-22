package com.cts.restfulwebservices.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<DAOUser, Long> {
    List<DAOUser> findByUsername(String username);
    List<DAOUser> findAll();
}
