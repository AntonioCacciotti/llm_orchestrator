package com.catoritech.player.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class PlayerProfileResponse {

    public Long id;
    public String username;
    public String email;
    public String name;
    public String surname;
    public LocalDate birthday;
    public String mobilePhone;
    public String sex;
    public String role;
    public LocalDateTime createdAt;

    public PlayerProfileResponse(Long id, String username, String email, String name,
                                 String surname, LocalDate birthday, String mobilePhone,
                                 String sex, String role, LocalDateTime createdAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.name = name;
        this.surname = surname;
        this.birthday = birthday;
        this.mobilePhone = mobilePhone;
        this.sex = sex;
        this.role = role;
        this.createdAt = createdAt;
    }
}
