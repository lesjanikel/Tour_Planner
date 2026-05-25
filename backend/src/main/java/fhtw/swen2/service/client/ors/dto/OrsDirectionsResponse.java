package fhtw.swen2.service.client.ors.dto;

import java.util.List;

public record OrsDirectionsResponse(List<Feature> features) {

    public record Feature(Geometry geometry, Properties properties) {}

    public record Geometry(String type, List<List<Double>> coordinates) {}

    public record Properties(Summary summary) {}

    public record Summary(double distance, double duration) {}
}