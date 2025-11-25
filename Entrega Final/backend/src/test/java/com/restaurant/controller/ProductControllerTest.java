package com.restaurant.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.restaurant.model.Product;
import com.restaurant.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
class ProductControllerTest {
  @Autowired MockMvc mvc;
  @MockBean ProductRepository repository;
  ObjectMapper mapper = new ObjectMapper();

  @Test
  void list_products() throws Exception {
    Product p = new Product(); p.setId("1"); p.setName("Nachos"); p.setPrice(85); p.setCategoryId("1"); p.setActive(true); p.setCreatedAt(Instant.now().toString());
    when(repository.findAll()).thenReturn(List.of(p));
    mvc.perform(get("/products"))
      .andExpect(status().isOk())
      .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
  }

  @Test
  void create_product() throws Exception {
    Product p = new Product(); p.setId("1"); p.setName("Nachos"); p.setPrice(85); p.setCategoryId("1"); p.setActive(true); p.setCreatedAt(Instant.now().toString());
    when(repository.save(any(Product.class))).thenReturn(p);
    mvc.perform(post("/products").contentType(MediaType.APPLICATION_JSON)
      .content(mapper.writeValueAsString(p)))
      .andExpect(status().isOk());
  }

  @Test
  void update_product() throws Exception {
    Product p = new Product(); p.setId("1"); p.setName("Nachos"); p.setPrice(85); p.setCategoryId("1"); p.setActive(true); p.setCreatedAt(Instant.now().toString());
    when(repository.findById("1")).thenReturn(Optional.of(p));
    when(repository.save(any(Product.class))).thenReturn(p);
    mvc.perform(put("/products/1").contentType(MediaType.APPLICATION_JSON)
      .content(mapper.writeValueAsString(p)))
      .andExpect(status().isOk());
  }

  @Test
  void delete_product() throws Exception {
    when(repository.existsById("1")).thenReturn(true);
    mvc.perform(delete("/products/1"))
      .andExpect(status().isNoContent());
  }
}