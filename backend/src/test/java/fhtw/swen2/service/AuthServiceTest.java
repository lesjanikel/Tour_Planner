package fhtw.swen2.service;

import fhtw.swen2.dto.AuthResponse;
import fhtw.swen2.dto.LoginRequest;
import fhtw.swen2.dto.RegisterRequest;
import fhtw.swen2.model.User;
import fhtw.swen2.repository.UserRepository;
import fhtw.swen2.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private JwtService jwtService;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);
        jwtService = mock(JwtService.class);
        authService = new AuthService(userRepository, passwordEncoder, jwtService);
    }

    @Test
    void register_throwsWhenUsernameTaken() {
        // duplicate username must be rejected before saving
        when(userRepository.existsByUsername("alice")).thenReturn(true);
        assertThrows(IllegalArgumentException.class, () ->
            authService.register(new RegisterRequest("alice", "password1")));
    }

    @Test
    void login_returnsTokenOnSuccess() {
        // correct credentials must return a valid token and username
        User user = new User();
        user.setUsername("alice");
        user.setPasswordHash("hashed");
        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password1", "hashed")).thenReturn(true);
        when(jwtService.generateToken("alice")).thenReturn("jwt-token");

        AuthResponse res = authService.login(new LoginRequest("alice", "password1"));

        assertEquals("alice", res.username());
        assertEquals("jwt-token", res.token());
    }
}
