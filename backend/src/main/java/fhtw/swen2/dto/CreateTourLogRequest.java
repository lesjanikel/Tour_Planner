package fhtw.swen2.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

public record CreateTourLogRequest (
    @Size(max = 2000) String comment,
    @Min(1)@Max(5) int difficulty,
    @Min(1)@Max(5) int rating,
    @Min(0) long totalTime,
    @DecimalMin("0") double totalDistance,
    @NotNull LocalDateTime dateTime
){}
