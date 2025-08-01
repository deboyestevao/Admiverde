package pt.admiverde.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import pt.admiverde.model.Apartment;
import pt.admiverde.model.Payment;
import pt.admiverde.model.User;
import pt.admiverde.repository.ApartmentRepository;
import pt.admiverde.repository.PaymentRepository;
import pt.admiverde.repository.UserRepository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/client")
@CrossOrigin(origins = "*")
public class ClientController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ApartmentRepository apartmentRepository;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
            .body(Map.of(
                "message", "Área de cliente em manutenção",
                "status", "maintenance",
                "estimatedCompletion", "2-3 dias úteis"
            ));
    }
    
    @GetMapping("/apartments")
    public ResponseEntity<?> getMyApartments() {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
            .body(Map.of(
                "message", "Área de cliente em manutenção",
                "status", "maintenance",
                "estimatedCompletion", "2-3 dias úteis"
            ));
    }
    
    @GetMapping("/payments")
    public ResponseEntity<?> getMyPayments() {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
            .body(Map.of(
                "message", "Área de cliente em manutenção",
                "status", "maintenance",
                "estimatedCompletion", "2-3 dias úteis"
            ));
    }
    
    @GetMapping("/payments/{apartmentId}")
    public ResponseEntity<?> getPaymentsByApartment(@PathVariable Long apartmentId) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
            .body(Map.of(
                "message", "Área de cliente em manutenção",
                "status", "maintenance",
                "estimatedCompletion", "2-3 dias úteis"
            ));
    }
    
    @GetMapping("/payments/pending")
    public ResponseEntity<?> getPendingPayments() {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
            .body(Map.of(
                "message", "Área de cliente em manutenção",
                "status", "maintenance",
                "estimatedCompletion", "2-3 dias úteis"
            ));
    }
} 