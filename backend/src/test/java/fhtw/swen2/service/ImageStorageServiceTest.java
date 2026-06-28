package fhtw.swen2.service;

import fhtw.swen2.config.ImageProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.io.IOException;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

class ImageStorageServiceTest {

    @TempDir
    Path tempDir;

    private ImageStorageService service;

    @BeforeEach
    void setUp() throws IOException {
        service = new ImageStorageService(new ImageProperties(tempDir.toString()));
    }

    @Test
    void storeBytes_throwsForUnsupportedContentType() {
        // GIF and other non-allowed types must be rejected
        assertThrows(IllegalArgumentException.class, () ->
            service.storeBytes(new byte[]{1, 2, 3}, "image/gif", 1L));
    }

    @Test
    void storeBytes_returnsFilenameForValidImage() {
        // a valid PNG upload must be stored and return a non-blank filename
        String filename = service.storeBytes(new byte[]{1, 2, 3}, "image/png", 1L);
        assertNotNull(filename);
        assertTrue(filename.endsWith(".png"));
    }

}
