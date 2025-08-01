package pt.admiverde.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin")
public class AdminViewController {
    
    @GetMapping("/dashboard")
    public String dashboard() {
        return "admin/dashboard";
    }
    
    @GetMapping("/users")
    public String users() {
        return "admin/users";
    }
    

} 