package fhtw.swen2.service;

import fhtw.swen2.dto.CreateTourRequest;
import fhtw.swen2.dto.TourDto;
import fhtw.swen2.exception.NotFoundException;
import fhtw.swen2.model.Tour;
import fhtw.swen2.model.TourLog;
import fhtw.swen2.model.User;
import fhtw.swen2.repository.TourRepository;
import fhtw.swen2.service.client.ors.OrsClient;
import fhtw.swen2.service.client.ors.OrsRouteResult;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@Transactional
public class TourService {

    private final TourRepository tourRepository;
    private final OrsClient orsClient;
    private final ImageStorageService imageStorageService;

    public TourService(TourRepository tourRepository, OrsClient orsClient, ImageStorageService imageStorageService){
        this.tourRepository = tourRepository;
        this.orsClient = orsClient;
        this.imageStorageService = imageStorageService;
    }

    @Transactional(readOnly = true)
    public List<TourDto> findAll(User requester) {
        return tourRepository.findByOwnerId(requester.getId()).stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public TourDto findById(long id, User requester) {
        Tour tour = tourRepository.findByIdAndOwnerId(id,requester.getId())
                .orElseThrow(() -> new NotFoundException("Tour not found: " + id));
        return toDto(tour);
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
        Tour tour = tourRepository.findByIdAndOwnerId(id,requester.getId())
                .orElseThrow(() -> new NotFoundException("Tour not found: " + id));
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
        Tour tour = tourRepository.findByIdAndOwnerId(id,requester.getId())
                .orElseThrow(() -> new NotFoundException("Tour not found: " + id));
        if(tour.getImageFilename() != null){
            imageStorageService.delete(tour.getImageFilename());
        }
        tourRepository.delete(tour);
    }

    public TourDto setImage(long id, MultipartFile file, User requester) {
        Tour tour = tourRepository.findByIdAndOwnerId(id, requester.getId())
                .orElseThrow(() -> new NotFoundException("Tour not found: " + id));
        if (tour.getImageFilename() != null) {
            imageStorageService.delete(tour.getImageFilename());     // remove old
        }
        String filename = imageStorageService.store(file,id);
        tour.setImageFilename(filename);
        return toDto(tour);                                    // already exists, stays private
    }

    public TourDto clearImage(long id, User requester) {
        Tour tour = tourRepository.findByIdAndOwnerId(id, requester.getId())
                .orElseThrow(() -> new NotFoundException("Tour not found: " + id));
        if (tour.getImageFilename() != null) {
            imageStorageService.delete(tour.getImageFilename());
            tour.setImageFilename(null);
        }
        return toDto(tour);
    }

        private TourDto toDto(Tour tour) {


        List<TourLog> tourLogs = tour.getLogs();
        int popularity = tourLogs.size();
        Boolean childFriendly = computeChildFriendly(tourLogs);
        String imageUrl = tour.getImageFilename() == null ? null : "/images/" + tour.getImageFilename();
        return new TourDto(
                tour.getId(), tour.getName(), tour.getDescription(),
                tour.getFromName(), tour.getFromLat(), tour.getFromLon(),
                tour.getToName(), tour.getToLat(), tour.getToLon(),
                tour.getTransportType(), tour.getDistanceKm(), tour.getDurationSec(),
                tour.getRouteGeoJson(), imageUrl,
                tour.getOwner().getId(),
                popularity,childFriendly
        );
    }

    private Boolean computeChildFriendly(List<TourLog> logs) {
        if (logs.isEmpty()) return null;          // unknown

        double avgDifficulty = logs.stream().mapToInt(TourLog::getDifficulty).average().orElse(0);
        double avgTimeMin    = logs.stream().mapToLong(TourLog::getTotalTime).average().orElse(0);
        double avgDistanceKm = logs.stream().mapToDouble(TourLog::getTotalDistance).average().orElse(0);

        double d01 = avgDifficulty / 5.0;
        double t01 = Math.min(avgTimeMin / 480.0, 1.0);
        double k01 = Math.min(avgDistanceKm / 50.0, 1.0);

        double score = (0.5 * d01) + (0.25 * t01) + (0.25 * k01);   // 0..1
        return score * 10 <= 3.0;
    }
}
