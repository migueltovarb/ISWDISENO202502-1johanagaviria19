package com.restaurant.controller;

import com.restaurant.model.Order;
import com.restaurant.repository.OrderRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {
  private final OrderRepository repository;

  public OrderController(OrderRepository repository) {
    this.repository = repository;
  }

  @GetMapping
  public List<Order> all() { return repository.findAll(); }

  @PostMapping
  public Order create(@RequestBody Order order) { return repository.save(order); }

  @PutMapping("/{id}")
  public ResponseEntity<Order> update(@PathVariable String id, @RequestBody Order order) {
    return repository.findById(id)
      .map(existing -> {
        order.setId(existing.getId());
        return ResponseEntity.ok(repository.save(order));
      })
      .orElseGet(() -> ResponseEntity.notFound().build());
  }
}