package pt.admiverde.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pt.admiverde.model.Building;

import java.util.List;

@Repository
public interface BuildingRepository extends JpaRepository<Building, Long> {
    
    List<Building> findByCity(String city);
    
    List<Building> findByBuildingType(Building.BuildingType buildingType);
} 