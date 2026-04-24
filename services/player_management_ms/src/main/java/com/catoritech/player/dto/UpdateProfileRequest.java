package com.catoritech.player.dto;

import com.catoritech.player.model.Player;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class UpdateProfileRequest {

    @Size(min = 3, max = 50)
    public String username;

    @Email
    public String email;

    public String name;
    public String surname;
    public LocalDate birthday;
    public String mobilePhone;
    public Player.Sex sex;
}
