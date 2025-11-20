package com.evaluacion.vehiculos.controller;

import java.net.URI;
import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.evaluacion.vehiculos.model.Vehicle;
import com.evaluacion.vehiculos.repository.VehicleRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/vehicles")
@Validated
public class VehicleController {
    private final VehicleRepository repository;

    public VehicleController(VehicleRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Vehicle> findAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> findById(@PathVariable String id) {
        Optional<Vehicle> v = repository.findById(id);
        return v.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Vehicle> create(@Valid @RequestBody Vehicle vehicle) {
        Vehicle saved = repository.save(vehicle);
        return ResponseEntity.created(URI.create("/api/vehicles/" + saved.getId())).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vehicle> update(@PathVariable String id, @Valid @RequestBody Vehicle vehicle) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        vehicle.setId(id);
        Vehicle saved = repository.save(vehicle);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<Vehicle>> createBulk(@Valid @RequestBody List<Vehicle> vehicles) {
        List<Vehicle> saved = repository.saveAll(vehicles);
        return ResponseEntity.ok(saved);
    }
}