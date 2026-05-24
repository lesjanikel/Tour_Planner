package fhtw.swen2.service;

import fhtw.swen2.dto.CreateTourRequest;
import fhtw.swen2.dto.TourDto;
import fhtw.swen2.model.Tour;
import fhtw.swen2.model.User;
import fhtw.swen2.repository.TourRepository;
import fhtw.swen2.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TourService {

    private final TourRepository tourRepository;
    private final UserRepository userRepository;

    public TourService(TourRepository tourRepository, UserRepository userRepository){
        this.tourRepository = tourRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly=true)
    public List<TourDto> findAll(){
        return tourRepository.findAll().stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public TourDto findById(long id){
        Tour tour = tourRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Tour not found: " + id));
        return toDto(tour);
    }

    public TourDto create(CreateTourRequest request, long ownerId){
        User owner = userRepository.findById(ownerId).orElseThrow(() -> new EntityNotFoundException("User not found: " + ownerId));

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
        tour.setOwner(owner);

        // TODO: call ORS to fill in distanceKm, durationSec, routeGeoJson
        tour.setDistanceKm(0);
        tour.setDurationSec(0);

        return toDto(tourRepository.save(tour));
    }

    public TourDto update(long id, CreateTourRequest req) {
        Tour t = tourRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tour not found: " + id));

        t.setName(req.name());
        t.setDescription(req.description());
        t.setFromName(req.fromName());
        t.setFromLat(req.fromLat());
        t.setFromLon(req.fromLon());
        t.setToName(req.toName());
        t.setToLat(req.toLat());
        t.setToLon(req.toLon());
        t.setTransportType(req.transportType());

        // TODO: re-call ORS only if from/to/transport changed

        return toDto(t); // no save() needed — managed entity, flush on commit
    }

    public void delete(long id) {
        if (!tourRepository.existsById(id)) {
            throw new EntityNotFoundException("Tour not found: " + id);
        }
        tourRepository.deleteById(id);
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
