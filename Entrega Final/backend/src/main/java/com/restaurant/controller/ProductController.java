package com.restaurant.controller;

import com.restaurant.model.Product;
import com.restaurant.repository.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {
  private final ProductRepository repository;

  public ProductController(ProductRepository repository) {
    this.repository = repository;
  }

  @GetMapping
  public List<Product> all() { return repository.findAll(); }

  @PostMapping
  public Product create(@RequestBody Product product) { return repository.save(product); }

  @PutMapping("/{id}")
  public ResponseEntity<Product> update(@PathVariable String id, @RequestBody Product product) {
    return repository.findById(id)
      .map(existing -> {
        product.setId(existing.getId());
        return ResponseEntity.ok(repository.save(product));
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