package pt.admiverde.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pt.admiverde.model.Apartment;
import pt.admiverde.model.Building;
import pt.admiverde.model.Payment;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    List<Payment> findByApartment(Apartment apartment);
    
    List<Payment> findByBuilding(Building building);
    
    List<Payment> findByApartmentAndStatus(Apartment apartment, Payment.PaymentStatus status);
    
    List<Payment> findByBuildingAndStatus(Building building, Payment.PaymentStatus status);
    
    List<Payment> findByDueDateBetween(LocalDate startDate, LocalDate endDate);
    
    List<Payment> findByApartmentOrderByDueDateDesc(Apartment apartment);
} 