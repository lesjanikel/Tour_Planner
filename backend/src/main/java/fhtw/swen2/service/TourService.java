package fhtw.swen2.service;

import fhtw.swen2.dto.CreateTourRequest;
import fhtw.swen2.dto.TourDto;
import fhtw.swen2.exception.NotFoundException;
import fhtw.swen2.model.Tour;
import fhtw.swen2.model.User;
import fhtw.swen2.repository.TourRepository;
import fhtw.swen2.service.client.ors.OrsClient;
import fhtw.swen2.service.client.ors.OrsRouteResult;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TourService {

    private final TourRepository tourRepository;
    private final OrsClient orsClient;

    public TourService(TourRepository tourRepository, OrsClient orsClient){
        this.tourRepository = tourRepository;
        this.orsClient = orsClient;
    }

    @Transactional(readOnly = true)
    public List<TourDto> findAll(User requester) {
        return tourRepository.findByOwnerId(requester.getId()).stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public TourDto findById(long id, User requester) {
        return toDto(loadOwned(id, requester));
    }

    public TourDto create(CreateTourRequest request, User requester) {
        Tour tour = new Tour();
        tour.setName(request.name());
        tour.setDescription(request.description());
        tour.setFromName(request.fromName());
        tour.setFromLat(request.fromLat());
        tour.setFromLon(request.fromLon());
        tour.setToName(request.toName());
        tour.setToLat(request.toLat());
        tour.setToLon(request.toLon());
        tour.setTransportType(request.transportType());
        tour.setOwner(requester);
        OrsRouteResult route = orsClient.directions(
                request.fromLat(), request.fromLon(),
                request.toLat(), request.toLon(),
                request.transportType()
        );
        tour.setDistanceKm(route.distanceKm());
        tour.setDurationSec(route.durationSec());
        tour.setRouteGeoJson(route.geometry());
        return toDto(tourRepository.save(tour));
    }

    public TourDto update(long id, CreateTourRequest request, User requester) {
        Tour tour = loadOwned(id, requester);
        tour.setName(request.name());
        tour.setDescription(request.description());
        tour.setFromName(request.fromName());
        tour.setFromLat(request.fromLat());
        tour.setFromLon(request.fromLon());
        tour.setToName(request.toName());
        tour.setToLat(request.toLat());
        tour.setToLon(request.toLon());
        tour.setTransportType(request.transportType());
        OrsRouteResult route = orsClient.directions(
                request.fromLat(), request.fromLon(),
                request.toLat(), request.toLon(),
                request.transportType()
        );
        tour.setDistanceKm(route.distanceKm());
        tour.setDurationSec(route.durationSec());
        tour.setRouteGeoJson(route.geometry());
        return toDto(tour);
    }

    public void delete(long id, User requester) {
        Tour tour = loadOwned(id, requester);
        tourRepository.delete(tour);
    }

    private Tour loadOwned(long id, User requester) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Tour not found: " + id));
        if (tour.getOwner().getId() != requester.getId()) {
            throw new NotFoundException("Tour not found: " + id);
        }
        return tour;
    }

    private TourDto toDto(Tour tour) {
        return new TourDto(
                tour.getId(), tour.getName(), tour.getDescription(),
                tour.getFromName(), tour.getFromLat(), tour.getFromLon(),
                tour.getToName(), tour.getToLat(), tour.getToLon(),
                tour.getTransportType(), tour.getDistanceKm(), tour.getDurationSec(),
                tour.getRouteGeoJson(), tour.getImageFilename(),
                tour.getOwner().getId()
        );
    }
}
