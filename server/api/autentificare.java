package ro.credithub.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.credithub.dto.LoginRequest;
import ro.credithub.dto.LoginResponse;
import ro.credithub.dto.RegisterClientRequest;
import ro.credithub.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerClient(@RequestBody RegisterClientRequest request) {
        authService.registerClient(request);
        return ResponseEntity.ok().build();
    }
}