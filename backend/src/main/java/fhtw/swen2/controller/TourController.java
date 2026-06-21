package fhtw.swen2.controller;

import fhtw.swen2.dto.CreateTourRequest;
import fhtw.swen2.dto.ImportResult;
import fhtw.swen2.dto.TourDto;
import fhtw.swen2.model.User;
import fhtw.swen2.service.TourService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/tours")
public class TourController {

    private final TourService tourService;

    public TourController(TourService tourService) {
        this.tourService = tourService;
    }
    @GetMapping
    public List<TourDto> list(@AuthenticationPrincipal User user) {
        return tourService.findAll(user);
    }

    @GetMapping("/search")
    public List<TourDto> search(
            @RequestParam String q,
            @AuthenticationPrincipal User user
    ) {
        return tourService.search(q, user);
    }

    @GetMapping("/{id}")
    public TourDto get(@PathVariable long id, @AuthenticationPrincipal User user) {
        return tourService.findById(id, user);
    }

    @GetMapping("/{id}/export")
    public ResponseEntity<byte[]> export(@PathVariable long id,
                                         @AuthenticationPrincipal User user) throws Exception {
        return tourService.export(id, user);
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportAll(@AuthenticationPrincipal User user) throws Exception {
        return tourService.exportAll(user);
    }

    @PostMapping
    public ResponseEntity<TourDto> create(@Valid @RequestBody CreateTourRequest req,
                                          @AuthenticationPrincipal User user) {
        return ResponseEntity.status(201).body(tourService.create(req, user));
    }

    @PostMapping("/import")
    public ImportResult importTour(@RequestParam MultipartFile file,
                              @AuthenticationPrincipal User user) throws Exception {
        return tourService.importTour(file, user);
    }

    @PutMapping("/{id}")
    public TourDto update(@PathVariable long id,
                          @Valid @RequestBody CreateTourRequest req,
                          @AuthenticationPrincipal User user) {
        return tourService.update(id, req, user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable long id,
                                       @AuthenticationPrincipal User user) {
        tourService.delete(id, user);
        return ResponseEntity.noContent().build();
    }
}
