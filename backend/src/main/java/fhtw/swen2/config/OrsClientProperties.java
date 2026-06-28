package fhtw.swen2.config;

import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import java.net.URI;

@Validated
@ConfigurationProperties(prefix = "clients.ors")
public record OrsClientProperties (
        URI baseUrl,
        @NotBlank String apiKey,
        long connectTimeoutMs,
        long readTimeoutMs
){}
