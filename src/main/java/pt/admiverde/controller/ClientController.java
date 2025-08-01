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
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(user.get());
    }
    
    @GetMapping("/apartments")
    public ResponseEntity<?> getMyApartments() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        List<Apartment> apartments = apartmentRepository.findByOwner(user.get());
        return ResponseEntity.ok(apartments);
    }
    
    @GetMapping("/payments")
    public ResponseEntity<?> getMyPayments() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        List<Apartment> apartments = apartmentRepository.findByOwner(user.get());
        List<Payment> payments = apartments.stream()
                .flatMap(apartment -> paymentRepository.findByApartmentOrderByDueDateDesc(apartment).stream())
                .toList();
        
        return ResponseEntity.ok(payments);
    }
    
    @GetMapping("/payments/{apartmentId}")
    public ResponseEntity<?> getPaymentsByApartment(@PathVariable Long apartmentId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Optional<Apartment> apartment = apartmentRepository.findById(apartmentId);
        if (apartment.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        // Verificar se o apartamento pertence ao usuário
        if (!apartment.get().getOwner().getId().equals(user.get().getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        List<Payment> payments = paymentRepository.findByApartmentOrderByDueDateDesc(apartment.get());
        return ResponseEntity.ok(payments);
    }
    
    @GetMapping("/payments/pending")
    public ResponseEntity<?> getPendingPayments() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        List<Apartment> apartments = apartmentRepository.findByOwner(user.get());
        List<Payment> pendingPayments = apartments.stream()
                .flatMap(apartment -> paymentRepository.findByApartmentAndStatus(apartment, Payment.PaymentStatus.PENDING).stream())
                .toList();
        
        return ResponseEntity.ok(pendingPayments);
    }
} 