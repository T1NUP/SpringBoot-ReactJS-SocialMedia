package com.cts.rest.webservices.restfulwebservices.model;

import java.util.List;

public abstract class UserRepositoryImpl implements UserRepository {
    List<DAOUser> users = findAll();
}
