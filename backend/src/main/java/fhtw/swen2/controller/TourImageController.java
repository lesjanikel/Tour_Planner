package fhtw.swen2.controller;

import fhtw.swen2.dto.TourDto;
import fhtw.swen2.model.User;
import fhtw.swen2.service.TourService;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/tours/{tourId}/image")
public class TourImageController {

    private final TourService tourService;

    public TourImageController(TourService tourService) {
        this.tourService = tourService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public TourDto upload(@PathVariable long tourId, @RequestParam("file")MultipartFile file, @AuthenticationPrincipal User user){
        return tourService.setImage(tourId,file,user);
    }

    @DeleteMapping
    public TourDto delete(@PathVariable long tourId, @AuthenticationPrincipal User user){
        return tourService.clearImage(tourId,user);
    }

}
