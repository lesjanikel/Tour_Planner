package fhtw.swen2.repository;

import fhtw.swen2.model.TourLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TourLogRepository extends JpaRepository<TourLog, Long> {
    List<TourLog> findByTourOwnerId(long id);
    List<TourLog> findByTourId(long id);

}
