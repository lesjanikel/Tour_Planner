package fhtw.swen2.service.client.ors;

public record GeocodeFeature(
        String label,    // "Vienna, Austria"
        String layer,    // "locality" / "venue" / ...
        String country,
        double lat,
        double lon
) {}