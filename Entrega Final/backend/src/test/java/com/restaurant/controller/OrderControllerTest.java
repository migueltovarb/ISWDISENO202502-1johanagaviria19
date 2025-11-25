package com.restaurant.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.restaurant.model.Order;
import com.restaurant.repository.OrderRepository;
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

@WebMvcTest(OrderController.class)
class OrderControllerTest {
  @Autowired MockMvc mvc;
  @MockBean OrderRepository repository;
  ObjectMapper mapper = new ObjectMapper();

  @Test
  void list_orders() throws Exception {
    Order o = new Order(); o.setId("1"); o.setTotal(100); o.setStatus("completado"); o.setPaymentMethod("efectivo"); o.setUserId("1"); o.setUserName("Admin"); o.setCreatedAt(Instant.now().toString());
    when(repository.findAll()).thenReturn(List.of(o));
    mvc.perform(get("/orders"))
      .andExpect(status().isOk())
      .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
  }

  @Test
  void create_order() throws Exception {
    Order o = new Order(); o.setId("1"); o.setTotal(100); o.setStatus("completado"); o.setPaymentMethod("efectivo"); o.setUserId("1"); o.setUserName("Admin"); o.setCreatedAt(Instant.now().toString());
    when(repository.save(any(Order.class))).thenReturn(o);
    mvc.perform(post("/orders").contentType(MediaType.APPLICATION_JSON)
      .content(mapper.writeValueAsString(o)))
      .andExpect(status().isOk());
  }

  @Test
  void update_order() throws Exception {
    Order o = new Order(); o.setId("1"); o.setTotal(100); o.setStatus("completado"); o.setPaymentMethod("efectivo"); o.setUserId("1"); o.setUserName("Admin"); o.setCreatedAt(Instant.now().toString());
    when(repository.findById("1")).thenReturn(Optional.of(o));
    when(repository.save(any(Order.class))).thenReturn(o);
    mvc.perform(put("/orders/1").contentType(MediaType.APPLICATION_JSON)
      .content(mapper.writeValueAsString(o)))
      .andExpect(status().isOk());
  }
}