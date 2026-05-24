package fhtw.swen2.controller;

import fhtw.swen2.dto.AuthResponse;
import fhtw.swen2.dto.LoginRequest;
import fhtw.swen2.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    private final AuthService authService;

    public SessionController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping
    public AuthResponse login(@Valid @RequestBody LoginRequest req) {
        return authService.login(req);
    }
}