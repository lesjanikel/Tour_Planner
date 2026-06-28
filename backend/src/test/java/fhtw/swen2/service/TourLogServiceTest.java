package fhtw.swen2.service;

import fhtw.swen2.dto.CreateTourLogRequest;
import fhtw.swen2.exception.NotFoundException;
import fhtw.swen2.model.Tour;
import fhtw.swen2.model.TourLog;
import fhtw.swen2.model.User;
import fhtw.swen2.repository.TourLogRepository;
import fhtw.swen2.repository.TourRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class TourLogServiceTest {

    private TourLogRepository tourLogRepository;
    private TourRepository tourRepository;
    private TourLogService tourLogService;

    private User user;
    private Tour tour;

    @BeforeEach
    void setUp() {
        tourLogRepository = mock(TourLogRepository.class);
        tourRepository = mock(TourRepository.class);
        tourLogService = new TourLogService(tourLogRepository, tourRepository);

        user = new User();
        user.setUsername("alice");

        tour = new Tour();
    }

    @Test
    void findAll_throwsWhenTourNotOwnedByUser() {
        // listing logs for a tour the user doesn't own must be rejected
        when(tourRepository.findByIdAndOwnerId(1L, user.getId())).thenReturn(Optional.empty());
        assertThrows(NotFoundException.class, () -> tourLogService.findAll(1L, user));
    }

    @Test
    void create_savesLogAndReturnsDto() {
        // valid request must persist the log and return its fields
        when(tourRepository.findByIdAndOwnerId(1L, user.getId())).thenReturn(Optional.of(tour));
        TourLog saved = makeLog();
        when(tourLogRepository.save(any())).thenReturn(saved);

        var dto = tourLogService.create(makeRequest(), 1L, user);

        assertEquals(saved.getRating(), dto.rating());
        assertEquals(saved.getDifficulty(), dto.difficulty());
    }

    @Test
    void update_changesLogFields() {
        // update must apply the new values from the request
        TourLog log = makeLog();
        when(tourLogRepository.findByIdAndTourIdAndTourOwnerId(1L, 1L, user.getId()))
            .thenReturn(Optional.of(log));

        CreateTourLogRequest req = new CreateTourLogRequest(
            "updated", 2, 4, 60L, 20.0, LocalDateTime.now());
        var dto = tourLogService.update(1L, 1L, req, user);

        assertEquals("updated", dto.comment());
        assertEquals(4, dto.rating());
    }

    private CreateTourLogRequest makeRequest() {
        return new CreateTourLogRequest("nice", 1, 5, 30L, 10.0, LocalDateTime.now());
    }

    private TourLog makeLog() {
        TourLog log = new TourLog();
        log.setTour(tour);
        log.setComment("nice");
        log.setDifficulty(1);
        log.setRating(5);
        log.setTotalDistance(10.0);
        log.setTotalTime(30L);
        log.setDateTime(LocalDateTime.now());
        return log;
    }
}
