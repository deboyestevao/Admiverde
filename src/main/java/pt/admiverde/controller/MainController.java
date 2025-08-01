package pt.admiverde.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import pt.admiverde.model.User;
import pt.admiverde.service.UserService;

import java.util.Optional;

@Controller
public class MainController {
    
    private final UserService userService;
    
    public MainController(UserService userService) {
        this.userService = userService;
    }
    
    @GetMapping("/")
    public String home() {
        return "index";
    }
    
    @GetMapping("/home")
    public String homePage() {
        return "index";
    }
    
    @GetMapping("/login")
    public String login() {
        return "login";
    }
    
    @GetMapping("/login-success")
    public String loginSuccess() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
            Optional<User> userOpt = userService.findByUsername(auth.getName());
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                if (user.getRole() == User.UserRole.ADMIN) {
                    return "redirect:/admin/dashboard";
                } else {
                    return "redirect:/client/dashboard";
                }
            }
        }
        return "redirect:/login";
    }
    
    @GetMapping("/error")
    public String error() {
        return "error";
    }
} 