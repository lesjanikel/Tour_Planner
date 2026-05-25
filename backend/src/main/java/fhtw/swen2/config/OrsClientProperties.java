package fhtw.swen2.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.net.URI;

@ConfigurationProperties(prefix = "clients.ors")
public record OrsClientProperties (
        URI baseUrl,
        String apiKey,
        long connectTimeoutMs,
        long readTimeoutMs
){}
