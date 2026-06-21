package fhtw.swen2.dto;

import fhtw.swen2.model.RouteGeometry;
import fhtw.swen2.model.TransportType;

import java.util.List;

public record TourExportDto(
        String name,
        String description,
        String fromName,
        double fromLat,
        double fromLon,
        String toName,
        double toLat,
        double toLon,
        TransportType transportType,
        double distanceKm,
        long durationSec,
        RouteGeometry routeGeoJson,
        List<TourLogExportDto> logs,
        String imageContentType,
        String imageBase64
) {}
