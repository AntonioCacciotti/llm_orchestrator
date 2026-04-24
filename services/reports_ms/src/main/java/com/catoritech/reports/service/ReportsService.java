package com.catoritech.reports.service;

import com.catoritech.reports.client.PlayerManagementClient;
import com.catoritech.reports.dto.GenderBreakdownDto;
import com.catoritech.reports.dto.PlayerDto;
import com.catoritech.reports.dto.RegistrationTrendPointDto;
import com.catoritech.reports.dto.UsersReportResponse;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    public List<RegistrationTrendPointDto> getRegistrationTrend(String authorization) {
        List<PlayerDto> players = playerManagementClient.getPlayers(authorization);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        Map<String, Long> countsByDate = players.stream()
                .filter(p -> p.createdAt != null)
                .collect(Collectors.groupingBy(
                        p -> p.createdAt.toLocalDate().format(formatter),
                        Collectors.counting()
                ));

        return countsByDate.entrySet().stream()
                .sorted(Comparator.comparing(Map.Entry::getKey))
                .map(e -> new RegistrationTrendPointDto(e.getKey(), (int) (long) e.getValue()))
                .collect(Collectors.toList());
    }
}
