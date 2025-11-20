FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml ./
COPY src ./src
RUN mvn -q -DskipTests package

FROM eclipse-temurin:17-jre AS runtime
WORKDIR /app
COPY --from=build /app/target/vehiculos-api-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENV SPRING_DATA_MONGODB_URI=mongodb://localhost:27017/vehiculosdb
ENTRYPOINT ["java","-jar","/app/app.jar"]