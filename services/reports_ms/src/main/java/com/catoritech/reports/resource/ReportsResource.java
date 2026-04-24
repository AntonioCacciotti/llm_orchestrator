package com.catoritech.reports.resource;

import com.catoritech.reports.dto.RegistrationTrendPointDto;
import com.catoritech.reports.dto.UsersReportResponse;
import com.catoritech.reports.service.ReportsService;

import java.util.List;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.time.LocalDate;

@Path("/api/reports")
public class ReportsResource {

    @Inject
    ReportsService reportsService;

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

    @GET
    @Path("/admin/users")
    @Produces(MediaType.APPLICATION_JSON)
    public UsersReportResponse getAdminUsers(@HeaderParam("Authorization") String authorization) {
        return reportsService.getUsersReport(authorization);
    }

    @GET
    @Path("/admin/registrations/trend")
    @Produces(MediaType.APPLICATION_JSON)
    public List<RegistrationTrendPointDto> getRegistrationTrend(@HeaderParam("Authorization") String authorization) {
        return reportsService.getRegistrationTrend(authorization);
    }
}
