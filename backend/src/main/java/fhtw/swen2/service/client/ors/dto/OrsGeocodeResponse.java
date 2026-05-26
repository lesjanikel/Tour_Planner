package fhtw.swen2.service.client.ors.dto;

import java.util.List;

public record OrsGeocodeResponse(List<Feature> features) {

    public record Feature(Geometry geometry, Properties properties) {}

    public record Geometry(String type, List<Double> coordinates) {}  // [lon, lat]

    public record Properties(String label, String name, String layer,
                             String country, String region, String locality) {}
}