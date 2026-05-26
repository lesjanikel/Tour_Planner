package fhtw.swen2.service.client.ors;

import fhtw.swen2.config.OrsClientProperties;
import fhtw.swen2.exception.NotFoundException;
import fhtw.swen2.exception.UpstreamUnavailableException;
import fhtw.swen2.model.RouteGeometry;
import fhtw.swen2.model.TransportType;
import fhtw.swen2.service.client.ors.dto.OrsDirectionsRequest;
import fhtw.swen2.service.client.ors.dto.OrsDirectionsResponse;
import fhtw.swen2.service.client.ors.dto.OrsGeocodeResponse;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.List;

@Component
public class OrsWebClient implements OrsClient {

    private final WebClient wc;
    private final OrsClientProperties props;

    public OrsWebClient(WebClient orsWebClient, OrsClientProperties props) {
        this.wc = orsWebClient;
        this.props = props;
    }

    @Override
    public OrsRouteResult directions(double fromLat, double fromLon,
                                     double toLat, double toLon,
                                     TransportType transportType) {

        var body = new OrsDirectionsRequest(List.of(
                List.of(fromLon, fromLat),   // ORS expects LON, LAT
                List.of(toLon, toLat)
        ));

        OrsDirectionsResponse res = wc.post()
                .uri("/v2/directions/{profile}/geojson", profileFor(transportType))
                .bodyValue(body)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, r -> r.bodyToMono(String.class)
                        .defaultIfEmpty("")
                        .flatMap(b -> {
                            int sc = r.statusCode().value();
                            if (sc == 404) return Mono.error(new NotFoundException("No route between points"));
                            return Mono.error(new UpstreamUnavailableException("ORS " + sc + ": " + b));
                        }))
                .onStatus(HttpStatusCode::is5xxServerError, r -> r.bodyToMono(String.class)
                        .defaultIfEmpty("")
                        .flatMap(b -> Mono.error(new UpstreamUnavailableException("ORS 5xx: " + b))))
                .bodyToMono(OrsDirectionsResponse.class)
                .block(Duration.ofMillis(props.readTimeoutMs()));

        if (res == null || res.features() == null || res.features().isEmpty()) {
            throw new UpstreamUnavailableException("ORS returned empty response");
        }
        var feature = res.features().get(0);
        var summary = feature.properties().summary();
        var geometry = new RouteGeometry(
                feature.geometry().type(),
                feature.geometry().coordinates()
        );
        return new OrsRouteResult(
                summary.distance() / 1000.0,
                (long) summary.duration(),
                geometry
        );
    }
    @Override
    public List<GeocodeFeature> geocodeAutocomplete(String query, int limit) {
        OrsGeocodeResponse res = wc.get()
                .uri(uri -> uri.path("/geocode/autocomplete")
                        .queryParam("text", query)
                        .queryParam("size", limit)
                        .build())
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, r -> r.bodyToMono(String.class)
                        .defaultIfEmpty("")
                        .flatMap(b -> {
                            int sc = r.statusCode().value();
                            if (sc == 404) return Mono.error(new NotFoundException("No coordinates found"));
                            return Mono.error(new UpstreamUnavailableException("ORS " + sc + ": " + b));
                        }))
                .onStatus(HttpStatusCode::is5xxServerError, r -> r.bodyToMono(String.class)
                        .defaultIfEmpty("")
                        .flatMap(b -> Mono.error(new UpstreamUnavailableException("ORS 5xx: " + b))))
                .bodyToMono(OrsGeocodeResponse.class)
                .block(Duration.ofMillis(props.readTimeoutMs()));

        if (res == null || res.features() == null) return List.of();   // empty query → empty list

        return res.features().stream()
                .map(f -> new GeocodeFeature(
                        f.properties().label(),
                        f.properties().layer(),
                        f.properties().country(),
                        f.geometry().coordinates().get(1),   // lat
                        f.geometry().coordinates().get(0)    // lon
                ))
                .toList();
    }

    private static String profileFor(TransportType t) {
        return t.name().toLowerCase().replace('_', '-');
    }
}