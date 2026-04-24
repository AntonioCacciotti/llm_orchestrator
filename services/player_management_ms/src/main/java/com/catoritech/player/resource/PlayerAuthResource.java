package com.catoritech.player.resource;

import com.catoritech.player.dto.AuthResponse;
import com.catoritech.player.dto.LoginRequest;
import com.catoritech.player.dto.RegisterRequest;
import com.catoritech.player.service.PlayerService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/v1/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PlayerAuthResource {

    @Inject
    PlayerService playerService;

    @POST
    @Path("/register")
    public Response register(@Valid RegisterRequest request) {
        AuthResponse response = playerService.register(request);
        return Response.status(Response.Status.CREATED).entity(response).build();
    }

    @POST
    @Path("/login")
    public Response login(@Valid LoginRequest request) {
        AuthResponse response = playerService.login(request);
        return Response.ok(response).build();
    }
}
