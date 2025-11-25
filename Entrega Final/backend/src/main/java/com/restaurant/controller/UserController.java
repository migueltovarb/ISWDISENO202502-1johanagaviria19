package com.restaurant.controller;

import com.restaurant.model.User;
import com.restaurant.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
  private final UserRepository repository;

  public UserController(UserRepository repository) {
    this.repository = repository;
  }

  @GetMapping
  public List<User> all() { return repository.findAll(); }

  @PostMapping
  public User create(@RequestBody User user) { return repository.save(user); }

  @PutMapping("/{id}")
  public ResponseEntity<User> update(@PathVariable String id, @RequestBody User user) {
    return repository.findById(id)
      .map(existing -> {
        user.setId(existing.getId());
        return ResponseEntity.ok(repository.save(user));
      })
      .orElseGet(() -> ResponseEntity.notFound().build());
  }

  @PatchMapping("/{id}/active")
  public ResponseEntity<User> setActive(@PathVariable String id, @RequestBody java.util.Map<String, Boolean> body) {
    Boolean active = body.get("active");
    if (active == null) {
      return ResponseEntity.badRequest().build();
    }
    return repository.findById(id)
      .map(existing -> {
        existing.setActive(active);
        return ResponseEntity.ok(repository.save(existing));
      })
      .orElseGet(() -> ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable String id) {
    if (repository.existsById(id)) {
      repository.deleteById(id);
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.notFound().build();
  }
}
