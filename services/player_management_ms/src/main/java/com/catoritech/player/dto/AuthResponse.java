package com.catoritech.player.dto;

public class AuthResponse {

    public String token;
    public String tokenType = "Bearer";
    public long expiresIn;
    public PlayerProfile player;

    public AuthResponse(String token, long expiresIn, PlayerProfile player) {
        this.token = token;
        this.expiresIn = expiresIn;
        this.player = player;
    }

    public static class PlayerProfile {
        public Long id;
        public String username;
        public String email;
        public String name;
        public String surname;

        public PlayerProfile(Long id, String username, String email, String name, String surname) {
            this.id = id;
            this.username = username;
            this.email = email;
            this.name = name;
            this.surname = surname;
        }
    }
}
