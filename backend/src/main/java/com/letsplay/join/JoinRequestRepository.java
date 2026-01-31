package com.letsplay.join;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JoinRequestRepository extends JpaRepository<JoinRequest, Long> {
    List<JoinRequest> findByBookingId(Long bookingId);

    List<JoinRequest> findByRequesterId(Long requesterId);
}
