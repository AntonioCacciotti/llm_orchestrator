package com.example.player.dto;

import com.example.player.model.Player;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public class AdminUpdateRequest {

    @Size(min = 3, max = 50)
    public String username;

    @Email
    public String email;

    public String name;
    public String surname;
    public Player.Sex sex;
    public Player.Role role;
}
