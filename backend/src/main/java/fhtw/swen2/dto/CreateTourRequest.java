package fhtw.swen2.dto;

import fhtw.swen2.model.TransportType;
import jakarta.validation.constraints.*;

public record CreateTourRequest(
        @NotBlank @Size(max = 100) String name,
        @NotBlank @Size(max = 2000) String description,
        @NotBlank String fromName,
        @DecimalMin("-90") @DecimalMax("90") double fromLat,
        @DecimalMin("-180") @DecimalMax("180") double fromLon,
        @NotBlank String toName,
        @DecimalMin("-90") @DecimalMax("90") double toLat,
        @DecimalMin("-180") @DecimalMax("180") double toLon,
        @NotNull TransportType transportType
) { }