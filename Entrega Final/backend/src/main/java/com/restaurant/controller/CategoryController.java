package com.restaurant.controller;

import com.restaurant.model.Category;
import com.restaurant.repository.CategoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {
  private final CategoryRepository repository;

  public CategoryController(CategoryRepository repository) {
    this.repository = repository;
  }

  @GetMapping
  public List<Category> all() { return repository.findAll(); }

  @PostMapping
  public Category create(@RequestBody Category category) { return repository.save(category); }

  @PutMapping("/{id}")
  public ResponseEntity<Category> update(@PathVariable String id, @RequestBody Category category) {
    return repository.findById(id)
      .map(existing -> {
        category.setId(existing.getId());
        return ResponseEntity.ok(repository.save(category));
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