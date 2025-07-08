package com.tenxcards.flashcards.service;

import com.tenxcards.flashcards.dto.LoginUserCommand;
import com.tenxcards.flashcards.dto.LoginUserResponseDTO;
import com.tenxcards.flashcards.dto.RegisterUserCommand;
import com.tenxcards.flashcards.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.Map;

@Service
public class SupabaseAuthService {
    
    private final WebClient webClient;
    private final JwtTokenProvider jwtTokenProvider;
    
    @Value("${supabase.url}")
    private String supabaseUrl;
    
    @Value("${supabase.anon-key}")
    private String supabaseAnonKey;
    
    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;
    
    @Autowired
    public SupabaseAuthService(WebClient.Builder webClientBuilder, JwtTokenProvider jwtTokenProvider) {
        this.webClient = webClientBuilder
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(1024 * 1024))
                .build();
        this.jwtTokenProvider = jwtTokenProvider;
    }
    
    public LoginUserResponseDTO login(LoginUserCommand command) {
        try {
            System.out.println("SupabaseAuthService: Starting login for " + command.getEmail());
            System.out.println("Supabase URL: " + supabaseUrl);
            System.out.println("Supabase Anon Key: " + (supabaseAnonKey != null ? supabaseAnonKey.substring(0, 20) + "..." : "null"));
            
            // Test if API key works by hitting a simple endpoint first
            try {
                Map<String, Object> healthCheck = webClient.get()
                        .uri(supabaseUrl + "/auth/v1/settings")
                        .header("apikey", supabaseAnonKey)
                        .retrieve()
                        .bodyToMono(Map.class)
                        .block();
                System.out.println("Health check successful: " + healthCheck);
            } catch (Exception e) {
                System.out.println("Health check failed: " + e.getMessage());
            }
            
            Map<String, Object> requestBody = Map.of(
                    "email", command.getEmail(),
                    "password", command.getPassword()
            );
            
            // Try the correct endpoint based on GoTrue API
            System.out.println("Making request to: " + supabaseUrl + "/auth/v1/token?grant_type=password");
            
            Map<String, Object> response = webClient.post()
                    .uri(supabaseUrl + "/auth/v1/token?grant_type=password")
                    .header("apikey", supabaseAnonKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
            
            System.out.println("Supabase response received: " + (response != null ? "success" : "null"));
            
            if (response == null || !response.containsKey("user")) {
                throw new RuntimeException("Authentication failed - no user data received");
            }
            
            Map<String, Object> user = (Map<String, Object>) response.get("user");
            String userId = (String) user.get("id");
            String email = (String) user.get("email");
            
            if (userId == null || email == null) {
                throw new RuntimeException("Authentication failed - invalid user data");
            }
            
            // Generate our own JWT token
            String token = jwtTokenProvider.generateToken(userId, email, "");
            
            LoginUserResponseDTO.UserDTO userInfo = new LoginUserResponseDTO.UserDTO();
            userInfo.setId(userId);
            userInfo.setEmail(email);
            
            LoginUserResponseDTO loginResponse = new LoginUserResponseDTO();
            loginResponse.setToken(token);
            loginResponse.setUser(userInfo);
            
            return loginResponse;
            
        } catch (WebClientResponseException e) {
            throw new RuntimeException("Authentication failed: " + extractErrorMessage(e));
        } catch (Exception e) {
            throw new RuntimeException("Authentication failed: " + e.getMessage());
        }
    }
    
    public Map<String, Object> register(RegisterUserCommand command) {
        try {
            Map<String, Object> requestBody = Map.of(
                    "email", command.getEmail(),
                    "password", command.getPassword(),
                    "options", Map.of(
                            "emailRedirectTo", frontendUrl + "/auth/callback"
                    )
            );
            
            Map<String, Object> response = webClient.post()
                    .uri(supabaseUrl + "/auth/v1/signup")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + supabaseAnonKey)
                    .header("apikey", supabaseAnonKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
            
            if (response == null || !response.containsKey("user")) {
                throw new RuntimeException("Registration failed - no user data received");
            }
            
            Map<String, Object> user = (Map<String, Object>) response.get("user");
            
            // Check if email confirmation is needed
            Object identities = user.get("identities");
            if (identities instanceof java.util.List && ((java.util.List<?>) identities).isEmpty()) {
                throw new RuntimeException("This email is already registered. Please check your email for the confirmation link or try logging in.");
            }
            
            // Check if email is already confirmed
            Object confirmedAt = user.get("confirmed_at");
            if (confirmedAt != null) {
                return Map.of(
                        "user", user,
                        "requiresEmailConfirmation", false,
                        "message", "Registration successful! You can now log in."
                );
            }
            
            return Map.of(
                    "user", user,
                    "requiresEmailConfirmation", true,
                    "message", "Please check your email for a confirmation link to complete your registration."
            );
            
        } catch (WebClientResponseException e) {
            throw new RuntimeException("Registration failed: " + extractErrorMessage(e));
        } catch (Exception e) {
            throw new RuntimeException("Registration failed: " + e.getMessage());
        }
    }
    
    public Map<String, String> recover(String email) {
        // For now, just return success message
        // TODO: Implement actual password reset functionality with Supabase
        return Map.of("message", "If an account exists with that email, password reset instructions have been sent.");
    }
    
    public Map<String, String> logout() {
        // With JWT tokens, logout is handled client-side by removing the token
        return Map.of("message", "Logged out successfully");
    }
    
    private String extractErrorMessage(WebClientResponseException e) {
        try {
            String responseBody = e.getResponseBodyAsString();
            // Try to extract error message from Supabase response
            if (responseBody.contains("error_description")) {
                // Parse JSON manually for error_description
                int start = responseBody.indexOf("\"error_description\":\"") + 21;
                int end = responseBody.indexOf("\"", start);
                if (start > 20 && end > start) {
                    return responseBody.substring(start, end);
                }
            }
            return e.getMessage();
        } catch (Exception ex) {
            return e.getMessage();
        }
    }
}