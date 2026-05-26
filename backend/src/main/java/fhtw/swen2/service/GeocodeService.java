package fhtw.swen2.service;

import fhtw.swen2.service.client.ors.GeocodeFeature;
import fhtw.swen2.service.client.ors.OrsClient;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GeocodeService {
    private final OrsClient orsClient;
    public GeocodeService(OrsClient orsClient) {
        this.orsClient = orsClient;
    }
    public List<GeocodeFeature> autocomplete(String q, int limit){
        if(q== null || q.isBlank()) return List.of();
        return orsClient.geocodeAutocomplete(q, limit);
    }
}
