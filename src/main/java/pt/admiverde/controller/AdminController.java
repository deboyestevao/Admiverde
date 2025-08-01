package pt.admiverde.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import pt.admiverde.model.Apartment;
import pt.admiverde.model.Building;
import pt.admiverde.model.Payment;
import pt.admiverde.model.User;
import pt.admiverde.repository.ApartmentRepository;
import pt.admiverde.repository.BuildingRepository;
import pt.admiverde.repository.PaymentRepository;
import pt.admiverde.repository.UserRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BuildingRepository buildingRepository;
    
    @Autowired
    private ApartmentRepository apartmentRepository;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    // User Management - Register new clients
    @PostMapping("/users/register")
    public ResponseEntity<?> registerClient(@RequestBody ClientRegistrationRequest request) {
        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email já existe");
        }
        
        // Generate unique username
        String baseUsername = request.getFirstName().toLowerCase() + "." + request.getLastName().toLowerCase();
        String username = baseUsername;
        int counter = 1;
        
        while (userRepository.findByUsername(username).isPresent()) {
            username = baseUsername + counter;
            counter++;
        }
        
        // Generate temporary password
        String tempPassword = UUID.randomUUID().toString().substring(0, 8);
        
        // Create user
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(tempPassword));
        user.setEmail(request.getEmail());
        user.setFullName(request.getFirstName() + " " + request.getLastName());
        user.setRole(User.UserRole.CLIENT);
        
        User savedUser = userRepository.save(user);
        
        // Return user info for admin to send via email
        Map<String, Object> response = Map.of(
            "id", savedUser.getId(),
            "username", username,
            "tempPassword", tempPassword,
            "email", request.getEmail(),
            "fullName", savedUser.getFullName(),
            "message", "Utilizador criado com sucesso. Envie as credenciais por email."
        );
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }
    
    @GetMapping("/users/clients")
    public ResponseEntity<List<User>> getClients() {
        return ResponseEntity.ok(userRepository.findAll().stream()
                .filter(user -> user.getRole() == User.UserRole.CLIENT)
                .toList());
    }
    
    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        user.setId(id);
        return ResponseEntity.ok(userRepository.save(user));
    }
    
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    // Building Management
    @GetMapping("/buildings")
    public ResponseEntity<List<Building>> getAllBuildings() {
        return ResponseEntity.ok(buildingRepository.findAll());
    }
    
    @PostMapping("/buildings")
    public ResponseEntity<Building> createBuilding(@RequestBody Building building) {
        return ResponseEntity.ok(buildingRepository.save(building));
    }
    
    @PutMapping("/buildings/{id}")
    public ResponseEntity<Building> updateBuilding(@PathVariable Long id, @RequestBody Building building) {
        if (!buildingRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        building.setId(id);
        return ResponseEntity.ok(buildingRepository.save(building));
    }
    
    @DeleteMapping("/buildings/{id}")
    public ResponseEntity<?> deleteBuilding(@PathVariable Long id) {
        if (!buildingRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        buildingRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    // Apartment Management
    @GetMapping("/apartments")
    public ResponseEntity<List<Apartment>> getAllApartments() {
        return ResponseEntity.ok(apartmentRepository.findAll());
    }
    
    @GetMapping("/buildings/{buildingId}/apartments")
    public ResponseEntity<List<Apartment>> getApartmentsByBuilding(@PathVariable Long buildingId) {
        return ResponseEntity.ok(apartmentRepository.findByBuildingId(buildingId));
    }
    
    @PostMapping("/apartments")
    public ResponseEntity<Apartment> createApartment(@RequestBody Apartment apartment) {
        return ResponseEntity.ok(apartmentRepository.save(apartment));
    }
    
    @PutMapping("/apartments/{id}")
    public ResponseEntity<Apartment> updateApartment(@PathVariable Long id, @RequestBody Apartment apartment) {
        if (!apartmentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        apartment.setId(id);
        return ResponseEntity.ok(apartmentRepository.save(apartment));
    }
    
    @DeleteMapping("/apartments/{id}")
    public ResponseEntity<?> deleteApartment(@PathVariable Long id) {
        if (!apartmentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        apartmentRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    // Payment Management
    @GetMapping("/payments")
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentRepository.findAll());
    }
    
    @GetMapping("/payments/building/{buildingId}")
    public ResponseEntity<List<Payment>> getPaymentsByBuilding(@PathVariable Long buildingId) {
        Optional<Building> building = buildingRepository.findById(buildingId);
        if (building.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(paymentRepository.findByBuilding(building.get()));
    }
    
    @PostMapping("/payments")
    public ResponseEntity<Payment> createPayment(@RequestBody Payment payment) {
        return ResponseEntity.ok(paymentRepository.save(payment));
    }
    
    @PutMapping("/payments/{id}")
    public ResponseEntity<Payment> updatePayment(@PathVariable Long id, @RequestBody Payment payment) {
        if (!paymentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        payment.setId(id);
        return ResponseEntity.ok(paymentRepository.save(payment));
    }
    
    @DeleteMapping("/payments/{id}")
    public ResponseEntity<?> deletePayment(@PathVariable Long id) {
        if (!paymentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        paymentRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    // Dashboard Statistics
    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats() {
        long totalBuildings = buildingRepository.count();
        long totalApartments = apartmentRepository.count();
        long totalUsers = userRepository.count();
        long totalPayments = paymentRepository.count();
        
        // Pagamentos pendentes - buscar todos os pagamentos pendentes
        List<Payment> allPayments = paymentRepository.findAll();
        List<Payment> pendingPayments = allPayments.stream()
                .filter(payment -> payment.getStatus() == Payment.PaymentStatus.PENDING)
                .toList();
        BigDecimal totalPendingAmount = pendingPayments.stream()
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Pagamentos vencidos - buscar todos os pagamentos vencidos
        List<Payment> overduePayments = allPayments.stream()
                .filter(payment -> payment.getStatus() == Payment.PaymentStatus.OVERDUE)
                .toList();
        BigDecimal totalOverdueAmount = overduePayments.stream()
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return ResponseEntity.ok(Map.of(
                "totalBuildings", totalBuildings,
                "totalApartments", totalApartments,
                "totalUsers", totalUsers,
                "totalPayments", totalPayments,
                "pendingPayments", pendingPayments.size(),
                "totalPendingAmount", totalPendingAmount,
                "overduePayments", overduePayments.size(),
                "totalOverdueAmount", totalOverdueAmount
        ));
    }
    
    public static class ClientRegistrationRequest {
        private String firstName;
        private String lastName;
        private String email;
        
        // Getters and Setters
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }
} 