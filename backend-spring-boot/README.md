# FemSphere Spring Boot Enterprise Microservice (Prototype)

This module provides a Spring Boot 3 + PostgreSQL alternative/supplemental microservice implementation for FemSphere enterprise deployments.

### Tech Stack
- **Framework:** Spring Boot 3.2.4
- **Language:** Java 17+
- **Persistence:** Spring Data JPA + Hibernate
- **Database:** PostgreSQL (`femsphere_db`)

### Build & Run
```bash
# Build with Maven
mvn clean package

# Run service
mvn spring-boot:run
```

*Note: The primary production REST API server used across the React Web dashboard and Flutter Mobile client is the Node.js/Express service located in the root repository directory (`server.js`).*
