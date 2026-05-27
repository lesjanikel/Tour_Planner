package fhtw.swen2.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.*;

@Configuration
@EnableConfigurationProperties(ImageProperties.class)
public class WebConfig implements WebMvcConfigurer {
    private final ImageProperties props;

    public WebConfig(ImageProperties props) {
        this.props = props;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry){
        Path baseDir = Paths.get(props.dir()).toAbsolutePath().normalize();
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:" + baseDir + "/");
    }
}
