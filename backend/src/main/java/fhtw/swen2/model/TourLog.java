package fhtw.swen2.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tour_logs")
@Getter
@Setter
@NoArgsConstructor
public class TourLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "tour_id", nullable = false)
    private Tour tour;

    @Column(nullable = false)
    private LocalDateTime dateTime;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(nullable = false)
    private int difficulty;

    @Column(nullable = false)
    private double totalDistance;

    @Column(nullable = false)
    private long totalTime;

    @Column(nullable = false)
    private int rating;
}
