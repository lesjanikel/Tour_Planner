package fhtw.swen2.exception;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;

import static org.junit.jupiter.api.Assertions.*;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void handleNotFound_returns404() {
        // NotFoundException must map to HTTP 404
        var detail = handler.handleNotFound(new NotFoundException("Tour not found"));
        assertEquals(HttpStatus.NOT_FOUND.value(), detail.getStatus());
    }

    @Test
    void handleBadCredentials_returns401() {
        // bad login attempt must map to HTTP 401
        var detail = handler.handleBadCredentials(new BadCredentialsException("wrong"));
        assertEquals(HttpStatus.UNAUTHORIZED.value(), detail.getStatus());
    }

}
