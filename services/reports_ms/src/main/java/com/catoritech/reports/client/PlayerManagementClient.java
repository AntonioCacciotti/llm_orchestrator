package com.catoritech.reports.client;

import com.catoritech.reports.dto.PlayerDto;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import java.util.List;

@RegisterRestClient(configKey = "player-management")
@Path("/api/v1/admin")
public interface PlayerManagementClient {

    @GET
    @Path("/players")
    @Produces(MediaType.APPLICATION_JSON)
    List<PlayerDto> getPlayers(@HeaderParam("Authorization") String authorization);
}
