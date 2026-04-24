package com.catoritech.player.resource;

import com.catoritech.player.dto.PlayerProfileResponse;
import com.catoritech.player.dto.UpdateProfileRequest;
import com.catoritech.player.service.PlayerService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.jwt.JsonWebToken;

@Path("/api/v1/players")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PlayerResource {

    @Inject
    PlayerService playerService;

    @Inject
    JsonWebToken jwt;

    @GET
    @Path("/me")
    @RolesAllowed("player")
    public Response getMe() {
        Long playerId = Long.parseLong(jwt.getSubject());
        PlayerProfileResponse profile = playerService.getPlayerById(playerId);
        return Response.ok(profile).build();
    }

    @PUT
    @Path("/me")
    @RolesAllowed("player")
    public Response updateMe(@Valid UpdateProfileRequest request) {
        Long playerId = Long.parseLong(jwt.getSubject());
        PlayerProfileResponse profile = playerService.updatePlayer(playerId, request);
        return Response.ok(profile).build();
    }
}
