package com.evaluacion.vehiculos.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.evaluacion.vehiculos.model.Vehicle;
import com.evaluacion.vehiculos.repository.VehicleRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(VehicleController.class)
class VehicleControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private VehicleRepository repository;

    @Test
    void shouldCreateVehicle() throws Exception {
        Vehicle toSave = new Vehicle(null, "Ford", "Focus", 2020, new BigDecimal("15000"));
        Vehicle saved = new Vehicle("abc123", "Ford", "Focus", 2020, new BigDecimal("15000"));
        when(repository.save(any(Vehicle.class))).thenReturn(saved);

        mockMvc.perform(post("/api/vehicles")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(toSave)))
            .andExpect(status().isCreated())
            .andExpect(header().string("Location", "/api/vehicles/" + saved.getId()))
            .andExpect(jsonPath("$.id").value(saved.getId()));
    }

    @Test
    void shouldGetAllVehicles() throws Exception {
        List<Vehicle> vehicles = List.of(
            new Vehicle("id1", "Toyota", "Corolla", 2019, new BigDecimal("12000")),
            new Vehicle("id2", "Honda", "Civic", 2018, new BigDecimal("11000"))
        );
        when(repository.findAll()).thenReturn(vehicles);

        mockMvc.perform(get("/api/vehicles"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value("id1"))
            .andExpect(jsonPath("$[1].id").value("id2"));
    }

    @Test
    void shouldGetVehicleByIdFound() throws Exception {
        Vehicle v = new Vehicle("id1", "Toyota", "Corolla", 2019, new BigDecimal("12000"));
        when(repository.findById(eq("id1"))).thenReturn(Optional.of(v));

        mockMvc.perform(get("/api/vehicles/id1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value("id1"));
    }

    @Test
    void shouldGetVehicleByIdNotFound() throws Exception {
        when(repository.findById(eq("missing"))).thenReturn(Optional.empty());
        mockMvc.perform(get("/api/vehicles/missing"))
            .andExpect(status().isNotFound());
    }

    @Test
    void shouldUpdateVehicleFound() throws Exception {
        Vehicle toUpdate = new Vehicle(null, "Ford", "Focus", 2021, new BigDecimal("16000"));
        Vehicle updated = new Vehicle("id1", "Ford", "Focus", 2021, new BigDecimal("16000"));
        when(repository.existsById(eq("id1"))).thenReturn(true);
        when(repository.save(any(Vehicle.class))).thenReturn(updated);

        mockMvc.perform(put("/api/vehicles/id1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(toUpdate)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value("id1"))
            .andExpect(jsonPath("$.year").value(2021));
    }

    @Test
    void shouldUpdateVehicleNotFound() throws Exception {
        Vehicle toUpdate = new Vehicle(null, "Ford", "Focus", 2021, new BigDecimal("16000"));
        when(repository.existsById(eq("missing"))).thenReturn(false);

        mockMvc.perform(put("/api/vehicles/missing")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(toUpdate)))
            .andExpect(status().isNotFound());
    }

    @Test
    void shouldDeleteVehicleFound() throws Exception {
        when(repository.existsById(eq("id1"))).thenReturn(true);
        mockMvc.perform(delete("/api/vehicles/id1"))
            .andExpect(status().isNoContent());
    }

    @Test
    void shouldDeleteVehicleNotFound() throws Exception {
        when(repository.existsById(eq("missing"))).thenReturn(false);
        mockMvc.perform(delete("/api/vehicles/missing"))
            .andExpect(status().isNotFound());
    }
}