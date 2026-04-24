package com.catoritech.player.resource;

import com.catoritech.player.dto.AdminPlayerResponse;
import com.catoritech.player.dto.AdminUpdateRequest;
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

    @PUT
    @Path("/players/{id}/suspend")
    @RolesAllowed("admin")
    public Response suspendPlayer(@PathParam("id") Long id) {
        return Response.ok(playerService.suspendPlayer(id)).build();
    }

    @PUT
    @Path("/players/{id}/activate")
    @RolesAllowed("admin")
    public Response activatePlayer(@PathParam("id") Long id) {
        return Response.ok(playerService.activatePlayer(id)).build();
    }

    @DELETE
    @Path("/players/{id}")
    @RolesAllowed("admin")
    public Response deletePlayer(@PathParam("id") Long id) {
        playerService.deletePlayer(id);
        return Response.noContent().build();
    }

    @PUT
    @Path("/players/{id}")
    @RolesAllowed("admin")
    public Response updatePlayer(@PathParam("id") Long id, AdminUpdateRequest request) {
        return Response.ok(playerService.adminUpdatePlayer(id, request)).build();
    }
}
