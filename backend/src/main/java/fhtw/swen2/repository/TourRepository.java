package fhtw.swen2.repository;

import fhtw.swen2.model.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface TourRepository extends JpaRepository<Tour, Long> {
    List<Tour> findByOwnerId(long ownerId);
}
