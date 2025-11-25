package com.restaurant.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.restaurant.model.User;
import com.restaurant.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
class AuthControllerTest {
  @Autowired MockMvc mvc;
  @MockBean UserRepository userRepository;
  ObjectMapper mapper = new ObjectMapper();

  @Test
  void login_ok() throws Exception {
    User u = new User();
    u.setId("1"); u.setUsername("admin"); u.setPassword("admin123"); u.setActive(true);
    when(userRepository.findByUsernameAndPasswordAndActive("admin","admin123",true)).thenReturn(Optional.of(u));
    mvc.perform(post("/auth/login").contentType(MediaType.APPLICATION_JSON)
        .content(mapper.writeValueAsString(java.util.Map.of("username","admin","password","admin123"))))
      .andExpect(status().isOk());
  }

  @Test
  void login_fail() throws Exception {
    when(userRepository.findByUsernameAndPasswordAndActive("bad","bad",true)).thenReturn(Optional.empty());
    mvc.perform(post("/auth/login").contentType(MediaType.APPLICATION_JSON)
        .content(mapper.writeValueAsString(java.util.Map.of("username","bad","password","bad"))))
      .andExpect(status().isUnauthorized());
  }
}