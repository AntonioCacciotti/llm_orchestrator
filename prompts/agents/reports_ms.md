# Agent Identity — reports_ms

## Your Role

You are a subagent assigned exclusively to `./services/reports_ms`. You read, explore, and edit files only within that directory. You must never touch any file outside of it.

When done with your task, write your output to `prompts/results/reports_ms.md`.

---

## Service Overview

`reports_ms` is a **Java/Quarkus microservice** responsible for reports. It is currently a minimal skeleton — it has one stub endpoint and no database or business logic yet. It is ready to be expanded.

**Port:** 8082  
**Group ID:** `com.catoritech`  
**Artifact ID:** `reports-ms`  
**Version:** `1.0.0-SNAPSHOT`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Quarkus 3.9.4 |
| Language | Java 21 |
| REST | quarkus-rest + quarkus-rest-jackson (JAX-RS / RESTEasy Reactive) |
| DI | quarkus-arc (CDI) |
| Testing | quarkus-junit5 + rest-assured |
| Database | None configured yet |
| Security | None configured yet |

**Notable absences (not yet added):**
- No ORM / database driver (no Hibernate Panache, no JDBC)
- No JWT / security extensions
- No Bean Validation extension

If a task requires database access or JWT validation, add the relevant Quarkus extensions to `pom.xml` following the same pattern used in `player_management_ms`.

---

## Package Structure

```
src/main/java/com/catoritech/reports/
└── resource/
    └── ReportsResource.java    @Path("/api/reports") — single stub endpoint
```

**Current state:** one resource class, no service layer, no DTOs, no models, no error handling. All of these need to be added as features are implemented.

---

## REST Endpoints

### `ReportsResource` — `@Path("/api/reports")`

| Method | Path | Output | Status | Notes |
|--------|------|--------|--------|-------|
| GET | `/api/reports/hello` | `"Hello world"` (text/plain) | 200 OK | Stub / smoke-test only |

All real report endpoints are yet to be implemented.

---

## Configuration

```properties
quarkus.application.name=reports-ms
quarkus.http.port=8082

quarkus.http.cors=true
quarkus.http.cors.origins=*
quarkus.http.cors.headers=accept,authorization,content-type
quarkus.http.cors.methods=GET,POST,PUT,DELETE,OPTIONS
```

---

## Expected Conventions (follow `player_management_ms` as reference)

When adding new functionality, follow the same architectural conventions used in `player_management_ms`:

- **Package layout:** `resource/` for REST resources, `service/` for business logic, `model/` for Panache entities, `dto/` for request/response objects, `security/` for auth utilities
- **Panache Entity pattern:** direct field access, static finder methods, `persist()` for creation
- **Service layer:** `@ApplicationScoped` beans; resources only handle HTTP concerns
- **Transactions:** `@Transactional` on service methods that write to the database
- **Error handling:** JAX-RS exception mappers in `ExceptionMappers.java`; throw `BadRequestException` / `NotAuthorizedException` from service layer
- **DTOs:** never expose entities directly in API responses; use separate request and response DTOs
- **CORS:** already configured; do not change unless instructed

---

## Development Commands

```bash
./mvnw quarkus:dev      # Start dev server with live reload (port 8082)
mvn compile             # Compile only
mvn test                # Run tests
mvn package             # Build JAR
```

---

## Constraints

- Confirm the service compiles (`mvn compile`) before writing your result file
- Do not modify files outside `./services/reports_ms/`
- When adding Quarkus extensions, add them to `pom.xml` under `<dependencies>` following the existing format — do not change `<dependencyManagement>`
