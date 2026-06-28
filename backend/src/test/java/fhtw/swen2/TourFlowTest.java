package fhtw.swen2;

import com.fasterxml.jackson.databind.ObjectMapper;
import fhtw.swen2.model.RouteGeometry;
import fhtw.swen2.model.TransportType;
import fhtw.swen2.service.client.ors.OrsClient;
import fhtw.swen2.service.client.ors.OrsRouteResult;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
class TourFlowTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:18-alpine");

    @DynamicPropertySource
    static void datasourceProps(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    MockMvc mockMvc;
    @Autowired
    ObjectMapper objectMapper;

    // ORS is the only thing we don't want to hit for real
    @MockitoBean
    OrsClient orsClient;

    @Test
    void protectedEndpoint_requiresAuthentication() throws Exception {
        // no token -> 401
        mockMvc.perform(get("/api/tours"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void fullFlow_registerLoginCreateSearch() throws Exception {
        // 1. register
        mockMvc.perform(post("/api/users")
                        .contentType("application/json")
                        .content("""                                                                                                                                                                                                                                                                              
                                {"username":"alice","password":"password1"}"""))
                .andExpect(status().isCreated());

        // 2. login -> grab the JWT
        String loginBody = mockMvc.perform(post("/api/sessions")
                        .contentType("application/json")
                        .content("""                                                                                                                                                                                                                                                                              
                                {"username":"alice","password":"password1"}"""))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        String token = objectMapper.readTree(loginBody).get("token").asText();

        // 3. create a tour (ORS mocked so no real HTTP call)
        var geometry = new RouteGeometry("LineString",
                List.of(List.of(16.3, 48.2), List.of(16.4, 48.3)));
        when(orsClient.directions(anyDouble(), anyDouble(), anyDouble(), anyDouble(), any()))
                .thenReturn(new OrsRouteResult(12.5, 3600L, geometry));

        mockMvc.perform(post("/api/tours")
                        .header("Authorization", "Bearer " + token)
                        .contentType("application/json")
                        .content("""                                                                                                                                                                                                                                                                              
                                {"name":"Mountain loop","description":"scenic ride",                                                                                                                                                                                                                                  
                                 "fromName":"A","fromLat":48.2,"fromLon":16.3,                                                                                                                                                                                                                                        
                                 "toName":"B","toLat":48.3,"toLon":16.4,                                                                                                                                                                                                                                              
                                 "transportType":"%s"}""".formatted(TransportType.CYCLING_REGULAR)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Mountain loop"))
                .andExpect(jsonPath("$.distanceKm").value(12.5));

        // 4. full-text search finds it
        mockMvc.perform(get("/api/tours/search")
                        .param("q", "mountain")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].name").value("Mountain loop"));
    }
}