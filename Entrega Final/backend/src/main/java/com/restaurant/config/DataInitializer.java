package com.restaurant.config;

import com.restaurant.model.Category;
import com.restaurant.model.Product;
import com.restaurant.model.User;
import com.restaurant.repository.CategoryRepository;
import com.restaurant.repository.ProductRepository;
import com.restaurant.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Instant;
import java.util.List;

@Configuration
public class DataInitializer {
  @Bean
  CommandLineRunner seed(UserRepository users, CategoryRepository categories, ProductRepository products) {
    return args -> {
      if (users.count() == 0) {
        User admin = new User();
        admin.setId("1");
        admin.setUsername("admin");
        admin.setPassword("admin123");
        admin.setRole("admin");
        admin.setName("Administrador");
        admin.setActive(true);
        admin.setCreatedAt(Instant.now().toString());
        User cashier = new User();
        cashier.setId("2");
        cashier.setUsername("cajero1");
        cashier.setPassword("cajero123");
        cashier.setRole("cajero");
        cashier.setName("Juan Pérez");
        cashier.setActive(true);
        cashier.setCreatedAt(Instant.now().toString());
        users.saveAll(List.of(admin, cashier));
      }
      if (categories.count() == 0) {
        Category c1 = new Category(); c1.setId("1"); c1.setName("Bebidas Calientes"); c1.setActive(true);
        Category c2 = new Category(); c2.setId("2"); c2.setName("Bebidas Frías"); c2.setActive(true);
        Category c3 = new Category(); c3.setId("3"); c3.setName("Comidas Rápidas"); c3.setActive(true);
        Category c4 = new Category(); c4.setId("4"); c4.setName("Postres"); c4.setActive(true);
        categories.saveAll(List.of(c1, c2, c3, c4));
      }
      if (products.count() == 0) {
        // Bebidas Calientes (cat 1)
        Product p1 = new Product(); p1.setId("1"); p1.setName("Café"); p1.setPrice(25); p1.setCategoryId("1"); p1.setActive(true); p1.setCreatedAt(Instant.now().toString());
        Product p2 = new Product(); p2.setId("2"); p2.setName("Té"); p2.setPrice(22); p2.setCategoryId("1"); p2.setActive(true); p2.setCreatedAt(Instant.now().toString());
        Product p3 = new Product(); p3.setId("3"); p3.setName("Chocolate Caliente"); p3.setPrice(28); p3.setCategoryId("1"); p3.setActive(true); p3.setCreatedAt(Instant.now().toString());
        // Bebidas Frías (cat 2)
        Product p4 = new Product(); p4.setId("4"); p4.setName("Jugo de Naranja"); p4.setPrice(30); p4.setCategoryId("2"); p4.setActive(true); p4.setCreatedAt(Instant.now().toString());
        Product p5 = new Product(); p5.setId("5"); p5.setName("Batido de Fresa"); p5.setPrice(35); p5.setCategoryId("2"); p5.setActive(true); p5.setCreatedAt(Instant.now().toString());
        Product p6 = new Product(); p6.setId("6"); p6.setName("Gaseosa"); p6.setPrice(25); p6.setCategoryId("2"); p6.setActive(true); p6.setCreatedAt(Instant.now().toString());
        // Comidas Rápidas (cat 3)
        Product p7 = new Product(); p7.setId("7"); p7.setName("Sandwich"); p7.setPrice(40); p7.setCategoryId("3"); p7.setActive(true); p7.setCreatedAt(Instant.now().toString());
        Product p8 = new Product(); p8.setId("8"); p8.setName("Empanada"); p8.setPrice(20); p8.setCategoryId("3"); p8.setActive(true); p8.setCreatedAt(Instant.now().toString());
        Product p9 = new Product(); p9.setId("9"); p9.setName("Pastel Salado"); p9.setPrice(45); p9.setCategoryId("3"); p9.setActive(true); p9.setCreatedAt(Instant.now().toString());
        // Postres (cat 4)
        Product p10 = new Product(); p10.setId("10"); p10.setName("Galletas"); p10.setPrice(15); p10.setCategoryId("4"); p10.setActive(true); p10.setCreatedAt(Instant.now().toString());
        Product p11 = new Product(); p11.setId("11"); p11.setName("Torta"); p11.setPrice(50); p11.setCategoryId("4"); p11.setActive(true); p11.setCreatedAt(Instant.now().toString());
        Product p12 = new Product(); p12.setId("12"); p12.setName("Brownie"); p12.setPrice(25); p12.setCategoryId("4"); p12.setActive(true); p12.setCreatedAt(Instant.now().toString());
        products.saveAll(List.of(p1,p2,p3,p4,p5,p6,p7,p8,p9,p10,p11,p12));
      }
    };
  }
}
