package fhtw.swen2.service;

import fhtw.swen2.dto.CreateTourRequest;
import fhtw.swen2.dto.ImportResult;
import fhtw.swen2.dto.TourDto;
import fhtw.swen2.dto.TourExportDto;
import fhtw.swen2.dto.TourLogExportDto;
import fhtw.swen2.exception.NotFoundException;
import fhtw.swen2.model.Tour;
import fhtw.swen2.model.TourLog;
import fhtw.swen2.model.User;
import fhtw.swen2.repository.TourRepository;
import fhtw.swen2.service.client.ors.OrsClient;
import fhtw.swen2.service.client.ors.OrsRouteResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Base64;
import java.util.Set;
import java.util.stream.Collectors;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ValidationException;

import java.util.List;

@Service
@Transactional
public class TourService {

    private static final Logger log = LoggerFactory.getLogger(TourService.class);

    private final TourRepository tourRepository;
    private final OrsClient orsClient;
    private final ImageStorageService imageStorageService;
    private final ObjectMapper objectMapper;
    private final jakarta.validation.Validator validator;

    public TourService(TourRepository tourRepository, OrsClient orsClient, ImageStorageService imageStorageService, ObjectMapper objectMapper){
        this.tourRepository = tourRepository;
        this.orsClient = orsClient;
        this.imageStorageService = imageStorageService;
        this.objectMapper = objectMapper;
        this.validator = jakarta.validation.Validation.buildDefaultValidatorFactory().getValidator();
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

    @Transactional(readOnly = true)
    public List<TourDto> search(String query, User requester) {
        return tourRepository.search(requester.getId(), query)
                .stream()
                .map(this::toDto)
                .toList();
    }

    public ResponseEntity<byte[]> export(long id, User user) throws Exception {
        Tour tour = tourRepository.findByIdAndOwnerId(id, user.getId())
                .orElseThrow(() -> new NotFoundException("Tour not found: " + id));

        byte[] json = objectMapper.writeValueAsBytes(toExportDto(tour));
        log.debug("User {} exported tour {}", user.getId(), id);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=tour-" + id + ".json")
                .contentType(MediaType.APPLICATION_JSON)
                .body(json);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<byte[]> exportAll(User user) throws Exception {
        List<Tour> tours = tourRepository.findByOwnerId(user.getId());

        byte[] json = objectMapper.writeValueAsBytes(tours.stream().map(this::toExportDto).toList());
        log.debug("User {} exported {} tours", user.getId(), tours.size());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=tours-export.json")
                .contentType(MediaType.APPLICATION_JSON)
                .body(json);
    }

    private TourExportDto toExportDto(Tour tour) {
        List<TourLogExportDto> logs = tour.getLogs().stream()
                .map(l -> new TourLogExportDto(
                        l.getDateTime(), l.getComment(), l.getDifficulty(),
                        l.getTotalDistance(), l.getTotalTime(), l.getRating()))
                .toList();

        String imageContentType = null;
        String imageBase64 = null;
        if (tour.getImageFilename() != null) {
            imageContentType = imageStorageService.contentTypeOf(tour.getImageFilename());
            imageBase64 = Base64.getEncoder().encodeToString(imageStorageService.readBytes(tour.getImageFilename()));
        }

        return new TourExportDto(
                tour.getName(), tour.getDescription(),
                tour.getFromName(), tour.getFromLat(), tour.getFromLon(),
                tour.getToName(), tour.getToLat(), tour.getToLon(),
                tour.getTransportType(), tour.getDistanceKm(), tour.getDurationSec(),
                tour.getRouteGeoJson(), logs, imageContentType, imageBase64
        );
    }

    public ImportResult importTour(MultipartFile file, User user) throws Exception {
        com.fasterxml.jackson.databind.JsonNode root = objectMapper.readTree(file.getBytes());

        List<TourDto> imported = new java.util.ArrayList<>();
        List<String> duplicates = new java.util.ArrayList<>();
        if (root.isArray()) {
            for (com.fasterxml.jackson.databind.JsonNode node : root) {
                importOrSkip(objectMapper.treeToValue(node, TourExportDto.class), user, imported, duplicates);
            }
        } else {
            importOrSkip(objectMapper.treeToValue(root, TourExportDto.class), user, imported, duplicates);
        }
        log.info("User {} import: {} imported, {} duplicates skipped", user.getId(), imported.size(), duplicates.size());
        return new ImportResult(imported, duplicates);
    }

    private void importOrSkip(TourExportDto dto, User user, List<TourDto> imported, List<String> duplicates) throws Exception {
        boolean alreadyExists = tourRepository.existsByOwnerIdAndNameIgnoreCaseAndFromNameIgnoreCaseAndToNameIgnoreCase(
                user.getId(), dto.name(), dto.fromName(), dto.toName());
        if (alreadyExists) {
            duplicates.add(dto.name());
        } else {
            imported.add(importSingle(dto, user));
        }
    }

    private TourDto importSingle(TourExportDto dto, User user) throws Exception {
        Tour tour = new Tour();
        tour.setName(dto.name());
        tour.setDescription(dto.description());
        tour.setFromName(dto.fromName());
        tour.setFromLat(dto.fromLat());
        tour.setFromLon(dto.fromLon());
        tour.setToName(dto.toName());
        tour.setToLat(dto.toLat());
        tour.setToLon(dto.toLon());
        tour.setTransportType(dto.transportType());
        tour.setDistanceKm(dto.distanceKm());
        tour.setDurationSec(dto.durationSec());
        tour.setRouteGeoJson(dto.routeGeoJson());
        tour.setOwner(user);

        if (dto.logs() != null) {
            for (TourLogExportDto logDto : dto.logs()) {
                TourLog log = new TourLog();
                log.setTour(tour);
                log.setDateTime(logDto.dateTime());
                log.setComment(logDto.comment());
                log.setDifficulty(logDto.difficulty());
                log.setTotalDistance(logDto.totalDistance());
                log.setTotalTime(logDto.totalTime());
                log.setRating(logDto.rating());
                tour.getLogs().add(log);
            }
        }

        Set<ConstraintViolation<Tour>> violations = validator.validate(tour);
        if (!violations.isEmpty()) {
            String detail = violations.stream().map(v -> v.getPropertyPath() + " " + v.getMessage())
                    .collect(Collectors.joining(", "));
            log.warn("Rejected import of tour '{}' for user {}: {}", dto.name(), user.getId(), detail);
            throw new ValidationException("Invalid tour data: " + detail);
        }

        if (tour.getDistanceKm() == 0 || tour.getRouteGeoJson() == null) {
            OrsRouteResult route = orsClient.directions(
                    tour.getFromLat(), tour.getFromLon(),
                    tour.getToLat(), tour.getToLon(),
                    tour.getTransportType()
            );
            tour.setDistanceKm(route.distanceKm());
            tour.setDurationSec(route.durationSec());
            tour.setRouteGeoJson(route.geometry());
        }

        Tour saved = tourRepository.save(tour);

        if (dto.imageBase64() != null) {
            byte[] imageBytes = Base64.getDecoder().decode(dto.imageBase64());
            String filename = imageStorageService.storeBytes(imageBytes, dto.imageContentType(), saved.getId());
            saved.setImageFilename(filename);
        }

        return toDto(saved);
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

        return logs.getFirst().getDifficulty() < 3;
    }
}
