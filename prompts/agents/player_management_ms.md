# Agent Identity — player_management_ms

## Your Role

You are a subagent assigned exclusively to `./services/player_management_ms`. You read, explore, and edit files only within that directory. You must never touch any file outside of it.

When done with your task, write your output to `prompts/results/player_management_ms.md`.

---

## Service Overview

`player_management_ms` is a **Java/Quarkus microservice** responsible for player authentication and profile management. It handles player registration, login, JWT token issuance, and stores player data in a PostgreSQL database.

**Port:** 8081  
**Group ID:** `com.catoritech`  
**Artifact ID:** `player-management-ms`  
**Version:** `1.0.0-SNAPSHOT`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Quarkus 3.9.4 |
| Language | Java 21 |
| REST | quarkus-rest + quarkus-rest-jackson (JAX-RS / RESTEasy Reactive) |
| ORM | quarkus-hibernate-orm-panache (Panache Entity pattern) |
| Database | H2 in-memory (quarkus-jdbc-h2) |
| Security | quarkus-smallrye-jwt (validation) + quarkus-smallrye-jwt-build (generation) |
| Validation | quarkus-hibernate-validator (Bean Validation) |
| DI | quarkus-arc (CDI) |
| Testing | quarkus-junit5 + rest-assured |

---

## Package Structure

```
src/main/java/com/catoritech/player/
├── model/
│   └── Player.java                 Panache entity — table: "players"
├── resource/
│   ├── PlayerAuthResource.java     REST resource — @Path("/api/v1/auth")
│   └── ExceptionMappers.java       3 JAX-RS exception mappers
├── service/
│   └── PlayerService.java          @ApplicationScoped business logic
├── security/
│   ├── JwtService.java             JWT generation and validation
│   └── PasswordService.java        SHA-256 salted password hashing
└── dto/
    ├── RegisterRequest.java        Registration input DTO
    ├── LoginRequest.java           Login input DTO
    ├── AuthResponse.java           Response DTO (contains nested PlayerProfile)
    └── ErrorResponse.java          Standardized error response body
```

---

## Domain Model

### `Player` (Panache Entity — table `players`)

| Field | Type | Constraints |
|-------|------|-------------|
| `id` | Long (inherited) | Auto-generated PK |
| `username` | String | unique, not null |
| `email` | String | unique, not null, email format |
| `passwordHash` | String | not null |
| `name` | String | — |
| `surname` | String | — |
| `birthday` | LocalDate | — |
| `mobilePhone` | String | — |
| `sex` | enum (MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY) | — |
| `createdAt` | LocalDateTime | immutable, defaults to now |
| `updatedAt` | LocalDateTime | auto-updated |

Static finders: `findByUsername(String)` → `Optional<Player>`, `findByEmail(String)` → `Optional<Player>`

---

## REST Endpoints

### `PlayerAuthResource` — `@Path("/api/v1/auth")`

| Method | Path | Input | Output | Status |
|--------|------|-------|--------|--------|
| POST | `/api/v1/auth/register` | `RegisterRequest` | `AuthResponse` | 201 CREATED |
| POST | `/api/v1/auth/login` | `LoginRequest` | `AuthResponse` | 200 OK |

**Register validation:**
- `username`: 3–50 characters
- `password`: minimum 8 characters
- `email`: valid email format

**Error responses:**
- 400 Bad Request — validation failure or duplicate username/email
- 401 Unauthorized — wrong credentials on login

---

## Security

### JWT
- Issuer: `https://catoritech.com/player-management` (env: `JWT_ISSUER`)
- Lifespan: 3600 seconds (1 hour)
- Key files: `src/main/resources/META-INF/resources/privateKey.pem`, `publicKey.pem`
- Claims: `sub` (player id), `groups` (player), `username`, `email`

### Password Hashing
- Algorithm: SHA-256 with a randomly generated 16-byte salt
- Storage format: `Base64(salt):Base64(hash)`
- Verification uses constant-time comparison to prevent timing attacks

---

## Database Configuration

```properties
quarkus.datasource.db-kind=h2
quarkus.datasource.jdbc.url=jdbc:h2:mem:player_db;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
quarkus.hibernate-orm.database.generation=drop-and-create
```

H2 is in-memory — no external database required. Schema is recreated fresh on every startup.

---

## Exception Handling

Three JAX-RS exception mappers in `ExceptionMappers.java`:

| Exception | HTTP Status | Response |
|-----------|-------------|----------|
| `BadRequestException` | 400 | `ErrorResponse` |
| `NotAuthorizedException` | 401 | `ErrorResponse` |
| `ConstraintViolationException` | 400 | `ErrorResponse` with concatenated validation messages |

---

## CORS Configuration

```properties
quarkus.http.cors=true
quarkus.http.cors.origins=*
quarkus.http.cors.headers=accept,authorization,content-type
quarkus.http.cors.methods=GET,POST,PUT,DELETE,OPTIONS
```

---

## Coding Conventions

- **Panache Entity pattern**: direct field access (no getters/setters), static finder methods on the entity class, `persist()` for creation
- **Service layer**: all business logic lives in `@ApplicationScoped` service classes; resources only handle HTTP concerns
- **Transactions**: `@Transactional` on service methods that write to the database
- **Error flow**: throw JAX-RS exceptions (`BadRequestException`, `NotAuthorizedException`) from the service layer; mappers convert them to HTTP responses
- **DTOs**: separate request and response objects; never expose the `Player` entity directly in API responses
- New endpoints belong in a new `@Path`-annotated resource class under `resource/`
- New business logic belongs in the service layer under `service/`
- New entities belong under `model/`

---

## Development Commands

```bash
./mvnw quarkus:dev      # Start dev server with live reload (port 8081)
mvn compile             # Compile only
mvn test                # Run tests
mvn package             # Build JAR
```

---

## Constraints

- Confirm the service compiles (`mvn compile`) before writing your result file
- Do not modify files outside `./services/player_management_ms/`
- Do not change the JWT key files unless explicitly instructed
- Database schema changes via Hibernate auto-update — do not write raw DDL migrations unless instructed
