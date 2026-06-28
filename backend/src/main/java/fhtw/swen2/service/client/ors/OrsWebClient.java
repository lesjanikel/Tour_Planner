package fhtw.swen2.service.client.ors;

import fhtw.swen2.config.OrsClientProperties;
import fhtw.swen2.exception.InvalidRouteException;
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
import java.util.ArrayList;
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
        ), true);   // geometry_simplify: ask ORS for a lighter line

        OrsDirectionsResponse res = wc.post()
                .uri("/v2/directions/{profile}/geojson", profileFor(transportType))
                .bodyValue(body)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, r -> r.bodyToMono(String.class)
                        .defaultIfEmpty("")
                        .flatMap(b -> {
                            int sc = r.statusCode().value();
                            if (sc == 404) return Mono.error(new NotFoundException("No route between points"));
                            if (b.contains("\"code\":2004")) return Mono.error(new InvalidRouteException(
                                    "The route is too long to calculate. Please choose start and end points that are closer together."));
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
        double distanceKm = summary.distance() / 1000.0;
        var geometry = new RouteGeometry(
                feature.geometry().type(),
                simplify(feature.geometry().coordinates(), distanceKm)
        );
        return new OrsRouteResult(
                distanceKm,
                (long) summary.duration(),
                geometry
        );
    }
    // Cap the number of stored points, scaled by distance, by uniform downsampling.
    // Keeps the map line legible while bounding the size of the persisted geometry.
    private static List<List<Double>> simplify(List<List<Double>> coords, double distanceKm) {
        int maxPoints = (int) Math.min(500, Math.max(50, distanceKm * 10));   // ~10 pts/km, clamped to [50, 500]
        if (coords.size() <= maxPoints) return coords;

        int stride = (int) Math.ceil((double) coords.size() / maxPoints);
        List<List<Double>> out = new ArrayList<>();
        for (int i = 0; i < coords.size(); i += stride) out.add(coords.get(i));

        var last = coords.get(coords.size() - 1);
        if (!out.get(out.size() - 1).equals(last)) out.add(last);   // always keep the destination
        return out;
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