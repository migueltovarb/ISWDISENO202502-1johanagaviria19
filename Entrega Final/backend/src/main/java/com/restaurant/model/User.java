package com.restaurant.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {
  @Id
  private String id;
  private String username;
  private String password;
  private String role;
  private String name;
  private boolean active;
  private String createdAt;

  public String getId() { return id; }
  public void setId(String id) { this.id = id; }
  public String getUsername() { return username; }
  public void setUsername(String username) { this.username = username; }
  public String getPassword() { return password; }
  public void setPassword(String password) { this.password = password; }
  public String getRole() { return role; }
  public void setRole(String role) { this.role = role; }
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  public boolean isActive() { return active; }
  public void setActive(boolean active) { this.active = active; }
  public String getCreatedAt() { return createdAt; }
  public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}