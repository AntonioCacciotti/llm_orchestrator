package com.catoritech.player;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@QuarkusTest
public class PlayerAuthResourceTest {

    @Test
    public void registerRequiresUsername() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"email\":\"test@example.com\",\"password\":\"password123\"}")
        .when()
            .post("/api/v1/auth/register")
        .then()
            .statusCode(400);
    }

    @Test
    public void registerRequiresEmail() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"username\":\"testuser\",\"password\":\"password123\"}")
        .when()
            .post("/api/v1/auth/register")
        .then()
            .statusCode(400);
    }

    @Test
    public void loginRequiresCredentials() {
        given()
            .contentType(ContentType.JSON)
            .body("{}")
        .when()
            .post("/api/v1/auth/login")
        .then()
            .statusCode(400);
    }
}
