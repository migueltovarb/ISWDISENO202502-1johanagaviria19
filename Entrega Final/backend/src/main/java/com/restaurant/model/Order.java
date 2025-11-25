package com.restaurant.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "orders")
public class Order {
  @Id
  private String id;
  private String customerId;
  private String customerName;
  private List<OrderItem> items;
  private double total;
  private String paymentMethod;
  private String status;
  private String userId;
  private String userName;
  private String createdAt;

  public String getId() { return id; }
  public void setId(String id) { this.id = id; }
  public String getCustomerId() { return customerId; }
  public void setCustomerId(String customerId) { this.customerId = customerId; }
  public String getCustomerName() { return customerName; }
  public void setCustomerName(String customerName) { this.customerName = customerName; }
  public List<OrderItem> getItems() { return items; }
  public void setItems(List<OrderItem> items) { this.items = items; }
  public double getTotal() { return total; }
  public void setTotal(double total) { this.total = total; }
  public String getPaymentMethod() { return paymentMethod; }
  public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }
  public String getUserId() { return userId; }
  public void setUserId(String userId) { this.userId = userId; }
  public String getUserName() { return userName; }
  public void setUserName(String userName) { this.userName = userName; }
  public String getCreatedAt() { return createdAt; }
  public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}