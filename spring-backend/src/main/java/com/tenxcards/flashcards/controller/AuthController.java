package com.tenxcards.flashcards.controller;

import com.tenxcards.flashcards.dto.*;
import com.tenxcards.flashcards.service.SupabaseAuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private SupabaseAuthService supabaseAuthService;
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginUserResponseDTO>> login(@Valid @RequestBody LoginUserCommand loginCommand) {
        try {
            System.out.println("Login attempt for email: " + loginCommand.getEmail());
            LoginUserResponseDTO responseDTO = supabaseAuthService.login(loginCommand);
            System.out.println("Login successful for email: " + loginCommand.getEmail());
            return ResponseEntity.ok(ApiResponse.success(responseDTO));
            
        } catch (Exception e) {
            System.err.println("Login failed for email: " + loginCommand.getEmail() + ", Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid email or password: " + e.getMessage()));
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Map<String, Object>>> register(@Valid @RequestBody RegisterUserCommand registerCommand) {
        try {
            if (!registerCommand.getPassword().equals(registerCommand.getConfirmPassword())) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Passwords do not match"));
            }
            
            Map<String, Object> response = supabaseAuthService.register(registerCommand);
            return ResponseEntity.ok(ApiResponse.success(response));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Registration failed: " + e.getMessage()));
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Map<String, String>>> logout() {
        SecurityContextHolder.clearContext();
        Map<String, String> response = supabaseAuthService.logout();
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    @PostMapping("/recover")
    public ResponseEntity<ApiResponse<Map<String, String>>> recover(@Valid @RequestBody RecoverPasswordCommand recoverCommand) {
        try {
            Map<String, String> response = supabaseAuthService.recover(recoverCommand.getEmail());
            return ResponseEntity.ok(ApiResponse.success(response));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Password recovery failed: " + e.getMessage()));
        }
    }
}