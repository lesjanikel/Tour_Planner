package fhtw.swen2.service.client.ors;

import fhtw.swen2.model.RouteGeometry;

public record OrsRouteResult(
        double distanceKm,
        long durationSec,
        RouteGeometry geometry
) {}