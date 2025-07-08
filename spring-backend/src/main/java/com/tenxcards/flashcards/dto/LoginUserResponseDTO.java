package com.tenxcards.flashcards.dto;

public class LoginUserResponseDTO {
    
    private String token;
    private UserDTO user;
    
    // Constructors
    public LoginUserResponseDTO() {}
    
    public LoginUserResponseDTO(String token, UserDTO user) {
        this.token = token;
        this.user = user;
    }
    
    // Getters and Setters
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public UserDTO getUser() {
        return user;
    }
    
    public void setUser(UserDTO user) {
        this.user = user;
    }
    
    public static class UserDTO {
        private String id;
        private String email;
        
        public UserDTO() {}
        
        public UserDTO(String id, String email) {
            this.id = id;
            this.email = email;
        }
        
        public String getId() {
            return id;
        }
        
        public void setId(String id) {
            this.id = id;
        }
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
    }
}