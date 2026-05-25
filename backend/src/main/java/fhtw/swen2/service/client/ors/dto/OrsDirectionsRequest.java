package fhtw.swen2.service.client.ors.dto;

import java.util.List;

public record OrsDirectionsRequest(
        List<List<Double>> coordinates  // [[fromLon, fromLat], [toLon, toLat]]
) {}