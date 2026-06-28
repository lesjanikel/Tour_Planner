package fhtw.swen2.service.client.ors.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record OrsDirectionsRequest(
        List<List<Double>> coordinates,  // [[fromLon, fromLat], [toLon, toLat]]
        @JsonProperty("geometry_simplify") boolean geometrySimplify
) {}