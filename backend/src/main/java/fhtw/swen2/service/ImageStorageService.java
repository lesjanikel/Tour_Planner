package fhtw.swen2.service;

import fhtw.swen2.config.ImageProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger log = LoggerFactory.getLogger(ImageStorageService.class);

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
        byte[] bytes;
        try (InputStream in = file.getInputStream()) {
            bytes = in.readAllBytes();
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to read uploaded image", e);
        }
        return storeBytes(bytes, file.getContentType(), tourId);
    }

    public String storeBytes(byte[] bytes, String contentType, long tourId){

        if(bytes == null || bytes.length == 0){
            throw new IllegalArgumentException("File is empty");
        }
        if(contentType == null || !ALLOWED_TYPES.contains(contentType)){
            throw new IllegalArgumentException("Unsupported image type: "+contentType);
        }

        String ext = extensionFor(contentType);

        String filename = tourId + "-" + UUID.randomUUID() + ext;
        Path target = baseDir.resolve(filename).normalize();
        if (!target.startsWith(baseDir)) {
            log.warn("Rejected path traversal attempt for generated filename '{}' (tour {})", filename, tourId);
            throw new IllegalArgumentException("Invalid path");
        }

        try {
            Files.write(target, bytes, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
        } catch (IOException e) {
            log.warn("Failed to store image '{}' for tour {}: {}", filename, tourId, e.getMessage());
            throw new UncheckedIOException("Failed to store image", e);
        }
        log.debug("Stored image '{}' for tour {}", filename, tourId);
        return filename;
    }

    public byte[] readBytes(String filename) {
        Path target = baseDir.resolve(filename).normalize();
        if (!target.startsWith(baseDir)) {
            log.warn("Rejected path traversal attempt for filename '{}'", filename);
            throw new IllegalArgumentException("Invalid path");
        }
        try {
            return Files.readAllBytes(target);
        } catch (IOException e) {
            log.warn("Failed to read image '{}': {}", filename, e.getMessage());
            throw new UncheckedIOException("Failed to read image", e);
        }
    }

    public String contentTypeOf(String filename) {
        String ext = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
        return switch (ext) {
            case "jpg", "jpeg" -> "image/jpeg";
            case "png" -> "image/png";
            case "webp" -> "image/webp";
            default -> throw new IllegalArgumentException("Unsupported image type for file: " + filename);
        };
    }

    private String extensionFor(String contentType) {
        return switch (contentType) {
            case "image/jpeg" -> ".jpg";
            case "image/png"  -> ".png";
            case "image/webp" -> ".webp";
            default -> throw new IllegalArgumentException("Unsupported image type");
        };
    }

    public void delete(String filename) {
        if (filename == null) return;
        Path target = baseDir.resolve(filename).normalize();
        if (!target.startsWith(baseDir)) {
            log.warn("Rejected path traversal attempt for filename '{}'", filename);
            return;
        }
        try {
            Files.deleteIfExists(target);
        } catch (IOException e) {
            log.warn("Failed to delete image '{}': {}", filename, e.getMessage());
            throw new UncheckedIOException("Failed to delete image", e);
        }
        log.debug("Deleted image '{}'", filename);
    }
}
