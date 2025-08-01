package pt.admiverde.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import pt.admiverde.model.User;
import pt.admiverde.service.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        System.out.println("=== LOGIN ATTEMPT ===");
        System.out.println("Username: " + loginRequest.getUsername());
        System.out.println("Password length: " + (loginRequest.getPassword() != null ? loginRequest.getPassword().length() : "null"));
        
        try {
            // Check if user exists first
            var userOptional = userService.findByUsername(loginRequest.getUsername());
            if (userOptional.isEmpty()) {
                System.out.println("User NOT found in database: " + loginRequest.getUsername());
                return ResponseEntity.badRequest().body("Utilizador não encontrado.");
            }
            
            User user = userOptional.get();
            System.out.println("User found in database: " + user.getFullName() + " (Role: " + user.getRole() + ")");
            
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            System.out.println("Authentication successful for user: " + user.getFullName());
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("role", user.getRole().toString());
            response.put("username", user.getUsername());
            response.put("fullName", user.getFullName());
            response.put("sessionId", SecurityContextHolder.getContext().getAuthentication().getName());
            response.put("redirectUrl", user.getRole() == User.UserRole.ADMIN ? "/admin/dashboard" : "/client/dashboard");
            
            System.out.println("Login successful for user: " + loginRequest.getUsername() + " with role: " + user.getRole());
            System.out.println("=== LOGIN SUCCESS ===");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("=== LOGIN FAILED ===");
            System.err.println("Login failed for user: " + loginRequest.getUsername());
            System.err.println("Error type: " + e.getClass().getSimpleName());
            System.err.println("Error message: " + e.getMessage());
            e.printStackTrace();
            
            String errorMessage = "Nome de utilizador ou palavra-passe incorretos.";
            if (e.getMessage() != null && e.getMessage().contains("User account is disabled")) {
                errorMessage = "Conta de utilizador desativada. Contacte o administrador.";
            } else if (e.getMessage() != null && e.getMessage().contains("User not found")) {
                errorMessage = "Utilizador não encontrado.";
            }
            
            return ResponseEntity.badRequest().body(errorMessage);
        }
    }
    
    @GetMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        SecurityContextHolder.clearContext();
        
        // Invalidate the session
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        
        // Clear any cookies
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                cookie.setValue("");
                cookie.setPath("/");
                cookie.setMaxAge(0);
                response.addCookie(cookie);
            }
        }
        
        // Clear localStorage on client side
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("message", "Logout successful");
        responseBody.put("redirectUrl", "/");
        
        return ResponseEntity.ok(responseBody);
    }
    
    @GetMapping("/session-info")
    public ResponseEntity<?> getSessionInfo() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
            User user = userService.findByUsername(auth.getName()).orElse(null);
            return ResponseEntity.ok(Map.of(
                "authenticated", true,
                "username", auth.getName(),
                "role", user != null ? user.getRole().toString() : "UNKNOWN",
                "fullName", user != null ? user.getFullName() : ""
            ));
        } else {
            return ResponseEntity.ok(Map.of("authenticated", false));
        }
    }
    
    @GetMapping("/check-auth")
    public ResponseEntity<?> checkAuthentication() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("=== CHECK AUTH ===");
        System.out.println("Auth object: " + auth);
        System.out.println("Auth name: " + (auth != null ? auth.getName() : "null"));
        System.out.println("Auth authenticated: " + (auth != null ? auth.isAuthenticated() : "null"));
        System.out.println("Auth authorities: " + (auth != null ? auth.getAuthorities() : "null"));
        
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
            User user = userService.findByUsername(auth.getName()).orElse(null);
            System.out.println("User found: " + (user != null ? user.getFullName() : "null"));
            System.out.println("User role: " + (user != null ? user.getRole() : "null"));
            
            return ResponseEntity.ok(Map.of(
                "authenticated", true,
                "username", auth.getName(),
                "role", user != null ? user.getRole().toString() : "UNKNOWN",
                "fullName", user != null ? user.getFullName() : ""
            ));
        } else {
            System.out.println("User not authenticated");
            return ResponseEntity.status(401).body(Map.of(
                "authenticated", false,
                "message", "User not authenticated"
            ));
        }
    }
    
    @PostMapping("/check-username")
    public ResponseEntity<Boolean> checkUsername(@RequestBody UsernameCheckRequest request) {
        boolean exists = userService.existsByUsername(request.getUsername());
        return ResponseEntity.ok(exists);
    }
    
    public static class LoginRequest {
        private String username;
        private String password;
        
        // Getters and Setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
    
    public static class UsernameCheckRequest {
        private String username;
        
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
    }
} 