package fhtw.swen2.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import fhtw.swen2.dto.CreateTourRequest;
import fhtw.swen2.dto.TourDto;
import fhtw.swen2.exception.NotFoundException;
import fhtw.swen2.model.*;
import fhtw.swen2.repository.TourRepository;
import fhtw.swen2.service.client.ors.OrsClient;
import fhtw.swen2.service.client.ors.OrsRouteResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TourServiceTest {

    private TourRepository tourRepository;
    private OrsClient orsClient;
    private TourService tourService;
    private User user;

    @BeforeEach
    void setUp() {
        tourRepository = mock(TourRepository.class);
        orsClient = mock(OrsClient.class);
        tourService = new TourService(
            tourRepository,
            orsClient,
            mock(ImageStorageService.class),
            new ObjectMapper()
        );
        user = new User();
        user.setUsername("alice");
    }

    @Test
    void findById_throwsWhenTourNotFound() {
        // requesting a tour that does not belong to the user must fail
        when(tourRepository.findByIdAndOwnerId(1L, user.getId())).thenReturn(Optional.empty());
        assertThrows(NotFoundException.class, () -> tourService.findById(1L, user));
    }

    @Test
    void delete_throwsWhenTourNotFound() {
        // deleting a non-existent tour must throw rather than silently succeed
        when(tourRepository.findByIdAndOwnerId(1L, user.getId())).thenReturn(Optional.empty());
        assertThrows(NotFoundException.class, () -> tourService.delete(1L, user));
    }

    @Test
    void create_savesOrsData(){
        RouteGeometry routeGeometry = new RouteGeometry("LineString", List.of(List.of(16.3,48.2), List.of(16.4,48.3)));
        OrsRouteResult route = new OrsRouteResult(12.5,3600L, routeGeometry );

        when(orsClient.directions(anyDouble(),anyDouble(),anyDouble(),anyDouble(),any())).thenReturn(route);
        Tour savedTour = new Tour();
        savedTour.setDistanceKm(12.5);
        savedTour.setDurationSec(3600L);
        savedTour.setRouteGeoJson(routeGeometry);
        savedTour.setOwner(user);
        when(tourRepository.save(any(Tour.class))).thenReturn(savedTour);

        CreateTourRequest request = new CreateTourRequest("Trip", "desc","A", 48.2,16.3,"B",48.3,16.4, TransportType.CYCLING_REGULAR);

        TourDto tourDto = tourService.create(request, user);

        assertEquals(12.5, tourDto.distanceKm());
        assertEquals(3600L, tourDto.durationSec());
        assertEquals(routeGeometry, tourDto.routeGeoJson());
        // verify these methods were called with these parameters
        verify(orsClient).directions(48.2,16.3,48.3,16.4, TransportType.CYCLING_REGULAR);
        verify(tourRepository).save(any(Tour.class));
    }

    @Test
    void search_isScopedToRequestingUser() {
        Tour tour = new Tour();
        tour.setName("Mountain loop");
        tour.setOwner(user);
        when(tourRepository.search(user.getId(), "mountain")).thenReturn(List.of(tour));

        List<TourDto> result = tourService.search("mountain", user);

        assertEquals(1, result.size());
        assertEquals("Mountain loop", result.getFirst().name());
        // the owner id passed to the repository must be the requester's, not anything else
        verify(tourRepository).search(eq(user.getId()), eq("mountain"));
    }

    @Test
    void findById_popularityEqualsLogCount() {
        // popularity is derived from the number of logs on the tour
        Tour tour = new Tour();
        tour.setOwner(user);
        tour.getLogs().add(makeLog(1));
        tour.getLogs().add(makeLog(2));
        tour.getLogs().add(makeLog(1));
        when(tourRepository.findByIdAndOwnerId(1L, user.getId())).thenReturn(Optional.of(tour));

        TourDto dto = tourService.findById(1L, user);

        assertEquals(3, dto.popularity());
    }
    @Test
    void findById_childFriendlyReflectsDifficulty() {
        // a tour with no logs has unknown child-friendliness; an easy log is child-friendly, a hard one is not
        Tour empty = new Tour();
        empty.setOwner(user);
        when(tourRepository.findByIdAndOwnerId(1L, user.getId())).thenReturn(Optional.of(empty));
        assertNull(tourService.findById(1L, user).childFriendly());

        Tour easy = new Tour();
        easy.setOwner(user);
        easy.getLogs().add(makeLog(1));
        when(tourRepository.findByIdAndOwnerId(2L, user.getId())).thenReturn(Optional.of(easy));
        assertTrue(tourService.findById(2L, user).childFriendly());

        Tour hard = new Tour();
        hard.setOwner(user);
        hard.getLogs().add(makeLog(5));
        when(tourRepository.findByIdAndOwnerId(3L, user.getId())).thenReturn(Optional.of(hard));
        assertFalse(tourService.findById(3L, user).childFriendly());
    }

    private TourLog makeLog(int difficulty) {
        TourLog log = new TourLog();
        log.setDifficulty(difficulty);
        log.setTotalTime(3600L);
        log.setTotalDistance(10.0);
        log.setRating(4);
        return log;
    }
}
