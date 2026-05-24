package fhtw.swen2.dto;

import fhtw.swen2.model.TransportType;

public record CreateTourRequest (
        String name,
        String description,
        String fromName,
        double fromLat,
        double fromLon,
        String toName,
        double toLat,
        double toLon,
        TransportType transportType
){}
