package com.restaurant.repository;

import com.restaurant.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
  Optional<User> findByUsernameAndPasswordAndActive(String username, String password, boolean active);
}