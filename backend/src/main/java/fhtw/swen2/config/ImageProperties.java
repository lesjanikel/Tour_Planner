package fhtw.swen2.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.images")
public record ImageProperties(String dir) {
}
