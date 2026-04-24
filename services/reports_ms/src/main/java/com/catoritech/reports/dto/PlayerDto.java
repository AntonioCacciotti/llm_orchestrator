package com.catoritech.reports.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class PlayerDto {
    public Long id;
    public String username;
    public String email;
    public String role;
    public String sex;
}
