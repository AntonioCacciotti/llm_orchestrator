package com.catoritech.reports.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

@JsonIgnoreProperties(ignoreUnknown = true)
public class PlayerDto {
    public Long id;
    public String username;
    public String email;
    public String role;
    public String sex;
    public LocalDateTime createdAt;
    public String status;
}
