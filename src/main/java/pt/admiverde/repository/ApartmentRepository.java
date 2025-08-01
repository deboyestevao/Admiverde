package pt.admiverde.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pt.admiverde.model.Apartment;
import pt.admiverde.model.Building;
import pt.admiverde.model.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApartmentRepository extends JpaRepository<Apartment, Long> {
    
    List<Apartment> findByBuilding(Building building);
    
    List<Apartment> findByOwner(User owner);
    
    Optional<Apartment> findByBuildingAndNumber(Building building, String number);
    
    List<Apartment> findByBuildingId(Long buildingId);
} 