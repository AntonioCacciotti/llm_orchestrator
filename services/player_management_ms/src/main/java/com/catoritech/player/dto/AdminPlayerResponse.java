package com.catoritech.player.dto;

import java.time.LocalDateTime;

public class AdminPlayerResponse {

    public Long id;
    public String username;
    public String email;
    public String role;
    public String sex;
    public String status;
    public LocalDateTime createdAt;

    public AdminPlayerResponse(Long id, String username, String email, String role, String sex, String status, LocalDateTime createdAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.sex = sex;
        this.status = status;
        this.createdAt = createdAt;
    }
}
