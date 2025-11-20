package com.evaluacion.vehiculos.config;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.evaluacion.vehiculos.model.Vehicle;
import com.evaluacion.vehiculos.repository.VehicleRepository;

@Configuration
public class DataLoader {
    @Bean
    CommandLineRunner loadData(VehicleRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                List<Vehicle> seed = List.of(
                    new Vehicle(null, "Toyota", "Corolla", 2019, new BigDecimal("12000")),
                    new Vehicle(null, "Honda", "Civic", 2018, new BigDecimal("11000")),
                    new Vehicle(null, "Ford", "Focus", 2020, new BigDecimal("15000")),
                    new Vehicle(null, "Chevrolet", "Onix", 2021, new BigDecimal("14000"))
                );
                repository.saveAll(seed);
            }
        };
    }
}