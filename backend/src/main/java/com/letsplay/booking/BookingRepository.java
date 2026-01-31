package com.letsplay.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);

    List<Booking> findByGroundId(Long groundId);

    java.util.List<Booking> findByGroundIdAndStartTimeBetween(Long groundId,
            java.time.LocalDateTime start, java.time.LocalDateTime end);
}
