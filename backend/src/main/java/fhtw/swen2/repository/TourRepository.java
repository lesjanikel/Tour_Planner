package fhtw.swen2.repository;

import fhtw.swen2.model.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

@Repository
public interface TourRepository extends JpaRepository<Tour, Long> {
    List<Tour> findByOwnerId(long ownerId);
    Optional<Tour> findByIdAndOwnerId(long id, long ownerId);
    boolean existsByOwnerIdAndNameIgnoreCaseAndFromNameIgnoreCaseAndToNameIgnoreCase(
            long ownerId, String name, String fromName, String toName);

// Search tours by tour fields and log comments
    @Query("""
SELECT DISTINCT t
FROM Tour t
LEFT JOIN t.logs l
WHERE t.owner.id = :ownerId
AND (
LOWER(t.name) LIKE LOWER(CONCAT('%', :query, '%'))
OR LOWER(t.description) LIKE LOWER(CONCAT('%', :query, '%'))
OR LOWER(l.comment) LIKE LOWER(CONCAT('%', :query, '%'))
)
""")
    List<Tour> search(long ownerId, String query);
}
