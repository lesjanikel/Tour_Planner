package fhtw.swen2.controller;

import fhtw.swen2.dto.CreateTourRequest;
import fhtw.swen2.dto.TourDto;
import fhtw.swen2.service.TourService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tours")
public class TourController {

    private final TourService tourService;

    public TourController(TourService tourService) {
        this.tourService = tourService;
    }
    @GetMapping
    public List<TourDto> list() {
        return tourService.findAll();
    }

    @GetMapping("/{id}")
    public TourDto get(@PathVariable long id) {
        return tourService.findById(id);
    }

    @PostMapping
    public ResponseEntity<TourDto> create(
            @RequestBody CreateTourRequest req,
            @RequestParam long ownerId   // TODO: replace with auth principal once JWT is in
    ) {
        TourDto created = tourService.create(req, ownerId);
        return ResponseEntity.status(201).body(created);
    }

    @PutMapping("/{id}")
    public TourDto update(@PathVariable long id, @RequestBody CreateTourRequest req) {
        return tourService.update(id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable long id) {
        tourService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
