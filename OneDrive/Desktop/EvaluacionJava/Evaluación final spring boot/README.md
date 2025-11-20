# Evaluación final: API CRUD de Vehículos (Spring Boot + MongoDB)

Este proyecto implementa un API REST para gestionar vehículos usando Java, Spring Boot y MongoDB. Además incluye una vista web simple para interactuar con la API, pruebas del controlador y configuración opcional de Docker.

## Requisitos
- Java 17+
- MongoDB accesible (por defecto `mongodb://localhost:27017/vehiculosdb`)
- Opcional: Maven o el Maven Wrapper incluido; Docker Desktop si deseas levantar con contenedores

## Arranque

### Opción A: Maven instalado
- `mvn spring-boot:run`

### Opción B: Windows sin Maven (Wrapper)
- `./mvnw.cmd spring-boot:run`

### Opción C: Docker
- `docker compose build`
- `docker compose up`
- App: `http://localhost:8080/`

## Endpoints
- `GET /api/vehicles` lista
- `GET /api/vehicles/{id}` detalle
- `POST /api/vehicles` crear (devuelve `201 Created` + `Location`)
- `PUT /api/vehicles/{id}` actualizar
- `DELETE /api/vehicles/{id}` eliminar
- `POST /api/vehicles/bulk` importar lista de vehículos

## Modelo
- `Vehicle` (`id`, `make`, `model`, `year`, `price`) con validaciones (`@NotBlank`, `@Min`, `@DecimalMin`)

## Vista Web
- `src/main/resources/static/index.html`
- Permite listar, crear, editar y eliminar vehículos
- Botón “Cargar ejemplos” para insertar datos de prueba

## Datos de ejemplo
- Se cargan automáticamente al iniciar si la colección está vacía
- También puedes cargar desde la vista con “Cargar ejemplos”

## Pruebas
- `VehicleControllerTest` con `@WebMvcTest` valida `201/200/404/204`
- Ejecuta: `mvn test` o `./mvnw.cmd test`

## Configuración
- `spring.data.mongodb.uri` en `src/main/resources/application.properties`

## Cómo verificamos
- Arrancamos el servicio
- Insertamos y listamos datos (vía vista y API)
- Confirmamos persistencia en Mongo usando la API (`GET /api/vehicles`)

## Estructura
- `pom.xml` dependencias
- `src/main/java/...` aplicación y controlador
- `src/main/resources/...` propiedades y vista
- `src/test/java/...` pruebas
- `Dockerfile` y `docker-compose.yml` (opcional)

---

Entrega conforme a: “Elabore un api que implemente un CRUD de vehículos con Mongo y entréguela en el repositorio. Java + Spring Boot + MongoDB”.