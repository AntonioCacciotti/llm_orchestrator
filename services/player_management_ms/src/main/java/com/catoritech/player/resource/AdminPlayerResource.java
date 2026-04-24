package com.catoritech.player.resource;

import com.catoritech.player.dto.AdminPlayerResponse;
import com.catoritech.player.service.PlayerService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/api/v1/admin")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AdminPlayerResource {

    @Inject
    PlayerService playerService;

    @GET
    @Path("/players")
    @RolesAllowed("admin")
    public Response getAllPlayers() {
        List<AdminPlayerResponse> players = playerService.getAllPlayers();
        return Response.ok(players).build();
    }
}
