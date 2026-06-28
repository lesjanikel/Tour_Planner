package fhtw.swen2.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import fhtw.swen2.dto.CreateTourRequest;
import fhtw.swen2.exception.NotFoundException;
import fhtw.swen2.model.TransportType;
import fhtw.swen2.model.User;
import fhtw.swen2.repository.TourRepository;
import fhtw.swen2.service.client.ors.OrsClient;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TourServiceTest {

    private TourRepository tourRepository;
    private TourService tourService;
    private User user;

    @BeforeEach
    void setUp() {
        tourRepository = mock(TourRepository.class);
        tourService = new TourService(
            tourRepository,
            mock(OrsClient.class),
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

}
