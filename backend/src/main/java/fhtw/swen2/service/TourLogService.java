package fhtw.swen2.service;

import fhtw.swen2.dto.CreateTourLogRequest;
import fhtw.swen2.dto.TourLogDto;
import fhtw.swen2.exception.NotFoundException;
import fhtw.swen2.model.Tour;
import fhtw.swen2.model.TourLog;
import fhtw.swen2.model.User;
import fhtw.swen2.repository.TourLogRepository;
import fhtw.swen2.repository.TourRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class TourLogService {
    private final TourLogRepository tourLogRepository;
    private final TourRepository tourRepository;

    public TourLogService(TourLogRepository tourLogRepository, TourRepository tourRepository) {
        this.tourLogRepository = tourLogRepository;
        this.tourRepository = tourRepository;
    }

    @Transactional(readOnly = true)
    public List<TourLogDto> findAll(long tourId,User requester){
        tourRepository.findByIdAndOwnerId(tourId,requester.getId()).orElseThrow(() -> new NotFoundException("Tour not found: " + tourId));
        return tourLogRepository.findByTourId(tourId).stream()
                .map(this::toDto)
                .toList();
    }
    @Transactional(readOnly = true)
    public TourLogDto findById(long tourId, long tourLogId, User requester) {
        TourLog tourLog = tourLogRepository.findByIdAndTourIdAndTourOwnerId(tourLogId,tourId,requester.getId())
                .orElseThrow(() -> new NotFoundException("Tourlog not found: " +tourLogId));
        return toDto(tourLog);
    }

    public TourLogDto create(CreateTourLogRequest request, long tourId, User requester){
        Tour tour = tourRepository.findByIdAndOwnerId(tourId,requester.getId()).orElseThrow(() -> new NotFoundException("Tour not found: " + tourId));

        TourLog tourLog = new TourLog();
        tourLog.setTour(tour);
        tourLog.setComment(request.comment());
        tourLog.setDifficulty(request.difficulty());
        tourLog.setRating(request.rating());
        tourLog.setDateTime(request.dateTime());
        tourLog.setTotalDistance(request.totalDistance());
        tourLog.setTotalTime(request.totalTime());

        return toDto(tourLogRepository.save(tourLog));
    }

    public TourLogDto update(long tourId, long tourLogId, CreateTourLogRequest request, User requester ){
        TourLog tourLog = tourLogRepository.findByIdAndTourIdAndTourOwnerId(tourLogId,tourId,requester.getId())
                .orElseThrow(() -> new NotFoundException("Tourlog not found: " +tourLogId));
        tourLog.setComment(request.comment());
        tourLog.setDifficulty(request.difficulty());
        tourLog.setRating(request.rating());
        tourLog.setTotalDistance(request.totalDistance());
        tourLog.setDateTime(request.dateTime());
        tourLog.setTotalTime(request.totalTime());
        return toDto(tourLog);
    }

    public void delete(long tourId, long tourLogId, User requester){
        TourLog tourLog = tourLogRepository.findByIdAndTourIdAndTourOwnerId(tourLogId,tourId,requester.getId())
                .orElseThrow(() -> new NotFoundException("Tourlog not found: " +tourLogId));
        tourLogRepository.delete(tourLog);
    }



    private TourLogDto toDto(TourLog tourLog) {
        return new TourLogDto(
                tourLog.getId(),
                tourLog.getDateTime(),tourLog.getComment(),
                tourLog.getDifficulty(), tourLog.getTotalDistance(),
                tourLog.getTotalTime(), tourLog.getRating()
        );
    }


}
