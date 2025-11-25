# Sistema de gestión de pedidos para cafetería

Este proyecto implementa un sistema de gestión de pedidos para una cafetería con:

- Frontend en `Next.js`
- Backend en `Java` con `Spring Boot`
- Persistencia en `MongoDB`

## Arquitectura

- `Entrega Final/backend/`: API REST en Java Spring Boot
  - Punto de entrada en `RestaurantApiApplication` (`Entrega Final/backend/src/main/java/com/restaurant/RestaurantApiApplication.java`)
  - Controladores: `ProductController`, `CategoryController`, `OrderController`, `UserController` (`Entrega Final/backend/src/main/java/com/restaurant/controller/*`)
  - Modelos: `Product`, `Category`, `Order`, `OrderItem`, `User` (`Entrega Final/backend/src/main/java/com/restaurant/model/*`)
  - Repositorios Spring Data (`Entrega Final/backend/src/main/java/com/restaurant/repository/*`)
  - Configuración y datos de ejemplo en `DataInitializer` (`Entrega Final/backend/src/main/java/com/restaurant/config/DataInitializer.java`)
  - Configuración de aplicación en `application.properties` (`Entrega Final/backend/src/main/resources/application.properties`)

- `Entrega Final/` (raíz): Frontend en Next.js (estructura `app/*`, componentes UI y utilidades)

## Backend: Java + Spring Boot + MongoDB

- Spring Boot inicia la aplicación en `RestaurantApiApplication` (`Entrega Final/backend/src/main/java/com/restaurant/RestaurantApiApplication.java:8`)
- Conexión a MongoDB mediante `spring.data.mongodb.uri` (`Entrega Final/backend/src/main/resources/application.properties:3`).
  - Por defecto: `mongodb://localhost:27017/restaurant`
  - Se puede sobrescribir con la variable de entorno `MONGODB_URI`.
- `DataInitializer` siembra usuarios, categorías y productos si la base está vacía (`Entrega Final/backend/src/main/java/com/restaurant/config/DataInitializer.java:18-66`).

### Endpoints principales

- `GET /products` lista productos (`Entrega Final/backend/src/main/java/com/restaurant/controller/ProductController.java:19-21`)
- `POST /products` crea producto (`Entrega Final/backend/src/main/java/com/restaurant/controller/ProductController.java:22-23`)
- `PUT /products/{id}` actualiza producto (`Entrega Final/backend/src/main/java/com/restaurant/controller/ProductController.java:25-33`)
- `DELETE /products/{id}` elimina producto (`Entrega Final/backend/src/main/java/com/restaurant/controller/ProductController.java:35-42`)
- Endpoints análogos existen para categorías, pedidos y usuarios en sus respectivos controladores.

## Cómo ejecutar

### Backend

1. Instalar Java 17+.
2. Instalar MongoDB y asegurarse de que esté en ejecución.
3. En `Entrega Final/backend`, ejecutar:

```
./mvnw spring-boot:run
```

En Windows, usar:

```
mvnw.cmd spring-boot:run
```

La API se expondrá en `http://localhost:8080`.

### Frontend

1. En `Entrega Final`, instalar dependencias:

```
npm install
```

2. Levantar el entorno de desarrollo:

```
npm run dev
```

La web estará en `http://localhost:3000`.

## Variables de entorno

- `MONGODB_URI`: URI de conexión para MongoDB. Ejemplo: `mongodb://localhost:27017/restaurant`.

## Notas

- Se excluyen artefactos de compilación (`.next`, `target`) del control de versiones.
- El proyecto incluye datos de ejemplo para facilitar pruebas iniciales.

