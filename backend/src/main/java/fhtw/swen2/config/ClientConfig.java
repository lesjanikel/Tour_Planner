package fhtw.swen2.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
@EnableConfigurationProperties(OrsClientProperties.class)
public class ClientConfig {

    @Bean
    WebClient orsApi(OrsClientProperties props) {
        return WebClient.builder()
                .baseUrl(props.baseUrl().toString())
                .defaultHeader(HttpHeaders.AUTHORIZATION, props.apiKey())
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }
}