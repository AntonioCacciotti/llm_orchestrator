package com.catoritech.reports.service;

import com.catoritech.reports.client.PlayerManagementClient;
import com.catoritech.reports.dto.GenderBreakdownDto;
import com.catoritech.reports.dto.PlayerDto;
import com.catoritech.reports.dto.UsersReportResponse;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import java.util.List;

@ApplicationScoped
public class ReportsService {

    @Inject
    @RestClient
    PlayerManagementClient playerManagementClient;

    public UsersReportResponse getUsersReport(String authorization) {
        List<PlayerDto> players = playerManagementClient.getPlayers(authorization);

        GenderBreakdownDto breakdown = new GenderBreakdownDto();
        breakdown.male = players.stream().filter(p -> "MALE".equals(p.sex)).count();
        breakdown.female = players.stream().filter(p -> "FEMALE".equals(p.sex)).count();
        breakdown.other = players.stream().filter(p -> "OTHER".equals(p.sex)).count();
        breakdown.preferNotToSay = players.stream().filter(p -> "PREFER_NOT_TO_SAY".equals(p.sex)).count();

        UsersReportResponse response = new UsersReportResponse();
        response.users = players;
        response.genderBreakdown = breakdown;

        return response;
    }
}
