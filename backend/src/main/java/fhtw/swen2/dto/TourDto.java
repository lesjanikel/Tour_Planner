package fhtw.swen2.dto;

import fhtw.swen2.model.RouteGeometry;
import fhtw.swen2.model.TransportType;

public record TourDto(
        long id,
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
        String imageFilename,
        long ownerId,
        int popularity,
        Boolean childFriendly
) {}
