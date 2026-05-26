package fhtw.swen2.controller;

import fhtw.swen2.service.GeocodeService;
import fhtw.swen2.service.client.ors.GeocodeFeature;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/geocode")
public class GeocodeController {

    private final GeocodeService geocodeService;
    public GeocodeController(GeocodeService geocodeService) {
        this.geocodeService = geocodeService;
    }

    @GetMapping
    public List<GeocodeFeature> autocomplete(@RequestParam String q, @RequestParam(defaultValue = "5")int limit){
        return geocodeService.autocomplete(q,limit);
    }
}
