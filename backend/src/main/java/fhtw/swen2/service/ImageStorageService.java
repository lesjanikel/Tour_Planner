package fhtw.swen2.service;

import fhtw.swen2.config.ImageProperties;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.nio.file.*;
import java.util.Set;
import java.util.UUID;


@Service
public class ImageStorageService {
    private final Path baseDir;

    private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/png", "image/webp");

    public ImageStorageService(ImageProperties props) throws IOException {
        this.baseDir = Paths.get(props.dir()).toAbsolutePath().normalize();
        Files.createDirectories(this.baseDir);
    }

    public String store(MultipartFile file, long tourId){

        if(file == null || file.isEmpty()){
            throw new IllegalArgumentException("File is empty");
        }
        String contentType = file.getContentType();
        if(contentType == null || !ALLOWED_TYPES.contains(contentType)){
            throw new IllegalArgumentException("Unsupported image type: "+contentType);
        }

        String ext = switch (contentType) {
            case "image/jpeg" -> ".jpg";
            case "image/png"  -> ".png";
            case "image/webp" -> ".webp";
            default -> throw new IllegalArgumentException("Unsupported image type");
        };

        String filename = tourId + "-" + UUID.randomUUID() + ext;
        Path target = baseDir.resolve(filename).normalize();
        if (!target.startsWith(baseDir)) {
            throw new IllegalArgumentException("Invalid path");
        }

        try (InputStream in = file.getInputStream()) {
            Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to store image", e);
        }
        return filename;
    }

    public void delete(String filename) {
        if (filename == null) return;
        Path target = baseDir.resolve(filename).normalize();
        if (!target.startsWith(baseDir)) return;
        try {
            Files.deleteIfExists(target);
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to delete image", e);
        }
    }
}
