package com.restaurant.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.restaurant.model.Category;
import com.restaurant.repository.CategoryRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CategoryController.class)
class CategoryControllerTest {
  @Autowired MockMvc mvc;
  @MockBean CategoryRepository repository;
  ObjectMapper mapper = new ObjectMapper();

  @Test
  void list_categories() throws Exception {
    Category c = new Category(); c.setId("1"); c.setName("Entradas"); c.setActive(true);
    when(repository.findAll()).thenReturn(List.of(c));
    mvc.perform(get("/categories"))
      .andExpect(status().isOk())
      .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
  }

  @Test
  void create_category() throws Exception {
    Category c = new Category(); c.setId("1"); c.setName("Entradas"); c.setActive(true);
    when(repository.save(any(Category.class))).thenReturn(c);
    mvc.perform(post("/categories").contentType(MediaType.APPLICATION_JSON)
      .content(mapper.writeValueAsString(c)))
      .andExpect(status().isOk());
  }

  @Test
  void update_category() throws Exception {
    Category c = new Category(); c.setId("1"); c.setName("Entradas"); c.setActive(true);
    when(repository.findById("1")).thenReturn(Optional.of(c));
    when(repository.save(any(Category.class))).thenReturn(c);
    mvc.perform(put("/categories/1").contentType(MediaType.APPLICATION_JSON)
      .content(mapper.writeValueAsString(c)))
      .andExpect(status().isOk());
  }

  @Test
  void delete_category() throws Exception {
    when(repository.existsById("1")).thenReturn(true);
    mvc.perform(delete("/categories/1"))
      .andExpect(status().isNoContent());
  }
}