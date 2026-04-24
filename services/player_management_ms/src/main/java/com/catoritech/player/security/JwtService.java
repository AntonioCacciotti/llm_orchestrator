package com.catoritech.player.security;

import com.catoritech.player.model.Player;
import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.time.Duration;
import java.util.Set;

@ApplicationScoped
public class JwtService {

    @ConfigProperty(name = "smallrye.jwt.new-token.lifespan", defaultValue = "3600")
    long tokenLifespanSeconds;

    @ConfigProperty(name = "smallrye.jwt.new-token.issuer")
    String issuer;

    public String generateToken(Player player) {
        return Jwt.issuer(issuer)
                .subject(player.id.toString())
                .groups(Set.of("player"))
                .claim("username", player.username)
                .claim("email", player.email)
                .expiresIn(Duration.ofSeconds(tokenLifespanSeconds))
                .sign();
    }

    public long getTokenLifespanSeconds() {
        return tokenLifespanSeconds;
    }
}
