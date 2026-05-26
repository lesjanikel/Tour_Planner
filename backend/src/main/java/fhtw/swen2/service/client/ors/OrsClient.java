package fhtw.swen2.service.client.ors;

import fhtw.swen2.model.TransportType;

import java.util.List;

public interface OrsClient {
    OrsRouteResult directions(double fromLat, double fromLon,
                              double toLat, double toLon,
                              TransportType transportType);
    List<GeocodeFeature> geocodeAutocomplete(String query, int limit);
}