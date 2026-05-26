package fhtw.swen2.controller;

import fhtw.swen2.dto.CreateTourLogRequest;
import fhtw.swen2.dto.TourLogDto;
import fhtw.swen2.model.User;
import fhtw.swen2.service.TourLogService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tours/{tourId}/logs")
public class TourLogController {

    private final TourLogService tourLogService;

    public TourLogController(TourLogService tourLogService) {
        this.tourLogService = tourLogService;
    }

    @GetMapping
    public List<TourLogDto> list(@PathVariable long tourId, @AuthenticationPrincipal User user) {
        return tourLogService.findAll(tourId, user);
    }

    @GetMapping("/{id}")
    public TourLogDto getById(@PathVariable long tourId,@PathVariable long id, @AuthenticationPrincipal User user) {
        return tourLogService.findById(tourId, id, user);
    }

    @PostMapping
    public ResponseEntity<TourLogDto> create(@PathVariable long tourId, @Valid @RequestBody CreateTourLogRequest request, @AuthenticationPrincipal User user) {
        return ResponseEntity.status(201).body(tourLogService.create(request,tourId,user));
    }

    @PutMapping("/{id}")
    public TourLogDto update(@PathVariable long tourId, @PathVariable long id, @Valid @RequestBody CreateTourLogRequest request, @AuthenticationPrincipal User user) {
        return tourLogService.update(tourId,id,request,user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable long tourId, @PathVariable long id, @AuthenticationPrincipal User user) {
        tourLogService.delete(tourId,id,user);
        return ResponseEntity.noContent().build();
    }

}
