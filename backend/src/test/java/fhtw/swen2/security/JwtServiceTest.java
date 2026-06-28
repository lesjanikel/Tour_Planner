package fhtw.swen2.security;

import com.auth0.jwt.exceptions.JWTVerificationException;
import fhtw.swen2.config.JwtProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService(new JwtProperties("test-secret-key-long-enough-32chars!!", 60L));
    }

    @Test
    void generateToken_embedsCorrectUsername() {
        // token subject must match the username it was generated for
        String token = jwtService.generateToken("alice");
        assertEquals("alice", jwtService.extractUsername(token));
    }

    @Test
    void extractUsername_throwsForTamperedToken() {
        // a token with an invalid signature must be rejected
        String token = jwtService.generateToken("alice");
        String tampered = token.substring(0, token.lastIndexOf('.') + 1) + "invalidsignature";
        assertThrows(JWTVerificationException.class, () -> jwtService.extractUsername(tampered));
    }
}
