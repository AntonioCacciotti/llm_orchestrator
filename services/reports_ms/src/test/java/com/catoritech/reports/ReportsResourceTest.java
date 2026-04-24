package com.catoritech.reports;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;

@QuarkusTest
class ReportsResourceTest {

    @Test
    void testHelloEndpoint() {
        given()
            .when().get("/api/reports/hello")
            .then()
            .statusCode(200)
            .body(is("Hello world"));
    }
}
