package fhtw.swen2.controller;

import fhtw.swen2.dto.AuthResponse;
import fhtw.swen2.dto.RegisterRequest;
import fhtw.swen2.dto.UserDto;
import fhtw.swen2.model.User;
import fhtw.swen2.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final AuthService authService;

    public UserController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.status(201).body(authService.register(req));
    }

    @GetMapping("/me")
    public UserDto me(@AuthenticationPrincipal User user) {
        return new UserDto(user.getId(), user.getUsername());
    }
}
