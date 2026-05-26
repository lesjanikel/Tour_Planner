package fhtw.swen2.dto;

import java.time.LocalDateTime;

public record TourLogDto (
        long id,
        LocalDateTime dateTime,
        String comment,
        int difficulty,
        double totalDistance,
        long totalTime,
        int rating
){}
