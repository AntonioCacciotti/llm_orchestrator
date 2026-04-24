package com.catoritech.player.dto;

public class AdminPlayerResponse {

    public Long id;
    public String username;
    public String email;
    public String role;
    public String sex;

    public AdminPlayerResponse(Long id, String username, String email, String role, String sex) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.sex = sex;
    }
}
