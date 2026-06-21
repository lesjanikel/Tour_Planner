package fhtw.swen2.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public record TourLogExportDto(
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime dateTime,
        String comment,
        int difficulty,
        double totalDistance,
        long totalTime,
        int rating
) {}
