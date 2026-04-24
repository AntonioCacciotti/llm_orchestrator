package com.catoritech.player.service;

import com.catoritech.player.dto.AdminPlayerResponse;
import com.catoritech.player.dto.AdminUpdateRequest;
import com.catoritech.player.dto.AuthResponse;
import com.catoritech.player.dto.LoginRequest;
import com.catoritech.player.dto.PlayerProfileResponse;
import com.catoritech.player.dto.RegisterRequest;
import com.catoritech.player.dto.UpdateProfileRequest;
import com.catoritech.player.model.Player;
import java.time.LocalDateTime;
import java.util.List;
import com.catoritech.player.security.JwtService;
import com.catoritech.player.security.PasswordService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotAuthorizedException;
import jakarta.ws.rs.NotFoundException;

@ApplicationScoped
public class PlayerService {

    @Inject
    PasswordService passwordService;

    @Inject
    JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (Player.findByUsername(request.username).isPresent()) {
            throw new BadRequestException("Username already taken");
        }
        if (Player.findByEmail(request.email).isPresent()) {
            throw new BadRequestException("Email already registered");
        }

        Player player = new Player();
        player.username = request.username;
        player.email = request.email;
        player.passwordHash = passwordService.hash(request.password);
        player.name = request.name;
        player.surname = request.surname;
        player.birthday = request.birthday;
        player.mobilePhone = request.mobilePhone;
        player.sex = request.sex;
        player.role = request.isAdmin ? Player.Role.ADMIN : Player.Role.PLAYER;
        player.persist();

        String token = jwtService.generateToken(player);
        return buildAuthResponse(token, player);
    }

    public AuthResponse login(LoginRequest request) {
        Player player = Player.findByUsername(request.username)
                .orElseThrow(() -> new NotAuthorizedException("Invalid username or password"));

        if (!passwordService.verify(request.password, player.passwordHash)) {
            throw new NotAuthorizedException("Invalid username or password");
        }

        String token = jwtService.generateToken(player);
        return buildAuthResponse(token, player);
    }

    public List<AdminPlayerResponse> getAllPlayers() {
        return Player.<Player>listAll().stream()
                .map(this::toAdminResponse)
                .toList();
    }

    @Transactional
    public AdminPlayerResponse suspendPlayer(Long id) {
        Player player = Player.<Player>findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Player not found"));
        if (player.status == Player.PlayerStatus.SUSPENDED) {
            throw new BadRequestException("Player is already suspended");
        }
        player.status = Player.PlayerStatus.SUSPENDED;
        return toAdminResponse(player);
    }

    @Transactional
    public AdminPlayerResponse activatePlayer(Long id) {
        Player player = Player.<Player>findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Player not found"));
        if (player.status == Player.PlayerStatus.ACTIVE) {
            throw new BadRequestException("Player is already active");
        }
        player.status = Player.PlayerStatus.ACTIVE;
        return toAdminResponse(player);
    }

    @Transactional
    public void deletePlayer(Long id) {
        Player player = Player.<Player>findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Player not found"));
        if (player.role == Player.Role.ADMIN) {
            throw new BadRequestException("Cannot delete an admin player");
        }
        player.delete();
    }

    @Transactional
    public AdminPlayerResponse adminUpdatePlayer(Long id, AdminUpdateRequest request) {
        Player player = Player.<Player>findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Player not found"));
        if (request.username != null && !request.username.equals(player.username)) {
            if (Player.findByUsername(request.username).isPresent()) {
                throw new BadRequestException("Username already taken");
            }
            player.username = request.username;
        }
        if (request.email != null && !request.email.equals(player.email)) {
            if (Player.findByEmail(request.email).isPresent()) {
                throw new BadRequestException("Email already registered");
            }
            player.email = request.email;
        }
        if (request.name != null) player.name = request.name;
        if (request.surname != null) player.surname = request.surname;
        if (request.sex != null) player.sex = request.sex;
        if (request.role != null) player.role = request.role;
        return toAdminResponse(player);
    }

    @Transactional
    public void backfillCreatedAt(Long id, LocalDateTime createdAt) {
        Player.update("createdAt = ?1 where id = ?2", createdAt, id);
    }

    public PlayerProfileResponse getPlayerById(Long id) {
        Player player = Player.<Player>findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Player not found"));
        return toProfileResponse(player);
    }

    @Transactional
    public PlayerProfileResponse updatePlayer(Long id, UpdateProfileRequest request) {
        Player player = Player.<Player>findByIdOptional(id)
                .orElseThrow(() -> new NotFoundException("Player not found"));

        if (request.username != null && !request.username.equals(player.username)) {
            if (Player.findByUsername(request.username).isPresent()) {
                throw new BadRequestException("Username already taken");
            }
            player.username = request.username;
        }
        if (request.email != null && !request.email.equals(player.email)) {
            if (Player.findByEmail(request.email).isPresent()) {
                throw new BadRequestException("Email already registered");
            }
            player.email = request.email;
        }
        if (request.name != null) player.name = request.name;
        if (request.surname != null) player.surname = request.surname;
        if (request.birthday != null) player.birthday = request.birthday;
        if (request.mobilePhone != null) player.mobilePhone = request.mobilePhone;
        if (request.sex != null) player.sex = request.sex;

        return toProfileResponse(player);
    }

    private AdminPlayerResponse toAdminResponse(Player player) {
        return new AdminPlayerResponse(
                player.id, player.username, player.email,
                player.role.name(),
                player.sex != null ? player.sex.name() : null,
                player.status.name(),
                player.createdAt);
    }

    private PlayerProfileResponse toProfileResponse(Player player) {
        return new PlayerProfileResponse(
                player.id, player.username, player.email, player.name, player.surname,
                player.birthday, player.mobilePhone,
                player.sex != null ? player.sex.name() : null,
                player.role.name(),
                player.createdAt
        );
    }

    private AuthResponse buildAuthResponse(String token, Player player) {
        AuthResponse.PlayerProfile profile = new AuthResponse.PlayerProfile(
                player.id, player.username, player.email, player.name, player.surname
        );
        return new AuthResponse(token, jwtService.getTokenLifespanSeconds(), profile);
    }
}
