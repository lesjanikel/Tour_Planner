export interface TourLog {
  id: number;
  dateTime: string;          // ISO LocalDateTime, e.g. "2026-05-27T14:30:00"
  comment: string;
  difficulty: number;        // 1–5
  totalDistance: number;     // km
  totalTime: number;         // minutes (long on backend)
  rating: number;            // 1–5
}

export interface CreateTourLogRequest {
  dateTime: string;
  comment: string;
  difficulty: number;
  totalDistance: number;
  totalTime: number;
  rating: number;
}
