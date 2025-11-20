package com.evaluacion.vehiculos.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.evaluacion.vehiculos.model.Vehicle;

public interface VehicleRepository extends MongoRepository<Vehicle, String> {}