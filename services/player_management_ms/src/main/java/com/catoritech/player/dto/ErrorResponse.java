package com.catoritech.player.dto;

import java.time.LocalDateTime;

public class ErrorResponse {

    public int status;
    public String error;
    public String message;
    public LocalDateTime timestamp = LocalDateTime.now();

    public ErrorResponse(int status, String error, String message) {
        this.status = status;
        this.error = error;
        this.message = message;
    }
}
