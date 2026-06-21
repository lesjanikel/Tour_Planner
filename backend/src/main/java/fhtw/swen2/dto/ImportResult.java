package fhtw.swen2.dto;

import java.util.List;

public record ImportResult(
        List<TourDto> imported,
        List<String> duplicates
) {}
