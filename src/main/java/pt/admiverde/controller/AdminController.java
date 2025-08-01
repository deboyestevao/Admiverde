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
import java.util.HashMap;

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
    @PostMapping("/register-client")
    public ResponseEntity<?> registerClient(@RequestBody ClientRegistrationRequest request) {
        try {
            // Validate required fields
            if (request.getFullName() == null || request.getFullName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Nome completo é obrigatório");
            }
            if (request.getAddress() == null || request.getAddress().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Morada é obrigatória");
            }
            if (request.getFloorFraction() == null || request.getFloorFraction().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Andar + fração é obrigatório");
            }
            if (request.getBuildingId() == null) {
                return ResponseEntity.badRequest().body("Prédio é obrigatório");
            }
            if (request.getNif() == null || request.getNif().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("NIF é obrigatório");
            }
            if (request.getInsurancePolicy() == null || request.getInsurancePolicy().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Apólice de seguro é obrigatória");
            }
            
            // Check if NIF already exists
            if (userRepository.findByNif(request.getNif()).isPresent()) {
                return ResponseEntity.badRequest().body("NIF já está registado no sistema");
            }
            
            // Get building
            Building building = buildingRepository.findById(request.getBuildingId())
                .orElseThrow(() -> new RuntimeException("Prédio não encontrado"));
            
            // Generate username from full name
            String username = generateUsername(request.getFullName());
            
            // Generate temporary password
            String tempPassword = generateTemporaryPassword();
            
            // Create user
            User user = new User();
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode(tempPassword));
            user.setFullName(request.getFullName());
            user.setAddress(request.getAddress());
            user.setFloorFraction(request.getFloorFraction());
            user.setBuilding(building);
            user.setEmail(request.getEmail() != null ? request.getEmail() : "");
            user.setPhone(request.getPhone());
            user.setMobile(request.getMobile());
            user.setNif(request.getNif());
            user.setInsurancePolicy(request.getInsurancePolicy());
            user.setRole(User.UserRole.CLIENT);
            user.setActive(true);
            
            User savedUser = userRepository.save(user);
            
            // Return response with credentials
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Condómino registado com sucesso");
            response.put("username", username);
            response.put("tempPassword", tempPassword);
            response.put("email", request.getEmail());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao registar condómino: " + e.getMessage());
        }
    }
    
    // User Management - Create new users (new format)
    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody CreateUserRequest request) {
        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email já existe"));
        }
        
        // Generate unique username from full name
        String[] nameParts = request.getFullName().split(" ");
        String baseUsername = nameParts[0].toLowerCase();
        if (nameParts.length > 1) {
            baseUsername += "." + nameParts[nameParts.length - 1].toLowerCase();
        }
        String username = baseUsername;
        int counter = 1;
        
        while (userRepository.findByUsername(username).isPresent()) {
            username = baseUsername + counter;
            counter++;
        }
        
        // Use provided password or generate temporary password
        String password = request.getPassword();
        if (password == null || password.trim().isEmpty()) {
            password = UUID.randomUUID().toString().substring(0, 8);
        }
        
        // Create user
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setRole(User.UserRole.valueOf(request.getUserType()));
        
        User savedUser = userRepository.save(user);
        
        // Return user info
        Map<String, Object> response = Map.of(
            "id", savedUser.getId(),
            "username", username,
            "tempPassword", password,
            "email", request.getEmail(),
            "fullName", savedUser.getFullName(),
            "message", "Utilizador criado com sucesso"
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
        List<Building> buildings = buildingRepository.findAll();
        return ResponseEntity.ok(buildings);
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
    
    private String generateUsername(String fullName) {
        String baseUsername = fullName.toLowerCase().replaceAll("[^a-z0-9]", ".");
        String username = baseUsername;
        int counter = 1;
        while (userRepository.findByUsername(username).isPresent()) {
            username = baseUsername + counter;
            counter++;
        }
        return username;
    }

    private String generateTemporaryPassword() {
        return UUID.randomUUID().toString().substring(0, 8);
    }

    public static class ClientRegistrationRequest {
        private String fullName;
        private String address;
        private String floorFraction;
        private Long buildingId;
        private String email;
        private String phone;
        private String mobile;
        private String nif;
        private String insurancePolicy;
        private String userType;
        
        // Getters and Setters
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
        
        public String getFloorFraction() { return floorFraction; }
        public void setFloorFraction(String floorFraction) { this.floorFraction = floorFraction; }
        
        public Long getBuildingId() { return buildingId; }
        public void setBuildingId(Long buildingId) { this.buildingId = buildingId; }
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        
        public String getMobile() { return mobile; }
        public void setMobile(String mobile) { this.mobile = mobile; }
        
        public String getNif() { return nif; }
        public void setNif(String nif) { this.nif = nif; }
        
        public String getInsurancePolicy() { return insurancePolicy; }
        public void setInsurancePolicy(String insurancePolicy) { this.insurancePolicy = insurancePolicy; }
        
        public String getUserType() { return userType; }
        public void setUserType(String userType) { this.userType = userType; }
    }
    
    public static class CreateUserRequest {
        private String fullName;
        private String email;
        private String password;
        private String userType;
        
        // Getters and Setters
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getUserType() { return userType; }
        public void setUserType(String userType) { this.userType = userType; }
    }
} 