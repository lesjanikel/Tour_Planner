package fhtw.swen2.repository;

import fhtw.swen2.model.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TourRepository extends JpaRepository<Tour, Long> {
    List<Tour> findByOwnerId(long ownerId);
    Optional<Tour> findByIdAndOwnerId(long id, long ownerId);
}
