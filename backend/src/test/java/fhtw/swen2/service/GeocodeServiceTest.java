package fhtw.swen2.service;

import fhtw.swen2.service.client.ors.GeocodeFeature;
import fhtw.swen2.service.client.ors.OrsClient;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class GeocodeServiceTest {

    private OrsClient orsClient;
    private GeocodeService geocodeService;

    @BeforeEach
    void setUp() {
        orsClient = mock(OrsClient.class);
        geocodeService = new GeocodeService(orsClient);
    }

    @Test
    void autocomplete_returnsEmptyListForBlankQuery() {
        // blank or whitespace input must not hit the external API
        assertEquals(List.of(), geocodeService.autocomplete("  ", 5));
        verifyNoInteractions(orsClient);
    }

    @Test
    void autocomplete_delegatesToOrsClientForValidQuery() {
        // valid query must be forwarded to the ORS client
        GeocodeFeature feature = new GeocodeFeature("Vienna", "city", "AT", 48.2, 16.3);
        when(orsClient.geocodeAutocomplete("Vienna", 5)).thenReturn(List.of(feature));
        assertEquals(List.of(feature), geocodeService.autocomplete("Vienna", 5));
    }
}
