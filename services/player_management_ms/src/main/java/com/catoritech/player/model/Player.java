package com.catoritech.player.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@Entity
@Table(name = "players",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = "username"),
        @UniqueConstraint(columnNames = "email")
    })
public class Player extends PanacheEntity {

    @NotBlank
    @Column(nullable = false, unique = true)
    public String username;

    @Email
    @NotBlank
    @Column(nullable = false, unique = true)
    public String email;

    @NotBlank
    @Column(nullable = false)
    public String passwordHash;

    public String name;
    public String surname;
    public LocalDate birthday;
    public String mobilePhone;

    @Enumerated(EnumType.STRING)
    public Sex sex;

    @Column(nullable = false, updatable = false)
    public LocalDateTime createdAt = LocalDateTime.now();

    public LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public static Optional<Player> findByUsername(String username) {
        return find("username", username).firstResultOptional();
    }

    public static Optional<Player> findByEmail(String email) {
        return find("email", email).firstResultOptional();
    }

    public enum Sex {
        MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY
    }
}
