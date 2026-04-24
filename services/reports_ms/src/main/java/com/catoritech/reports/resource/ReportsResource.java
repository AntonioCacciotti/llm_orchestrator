package com.catoritech.reports.resource;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import java.time.LocalDate;

@Path("/api/reports")
public class ReportsResource {

    @GET
    @Path("/hello")
    @Produces(MediaType.TEXT_PLAIN)
    public String hello() {
        return "Hello world";
    }

    @GET
    @Path("/today")
    @Produces(MediaType.TEXT_PLAIN)
    public String today() {
        return LocalDate.now().toString();
    }
}
