package com.letsplay.join;

import com.letsplay.booking.Booking;
import com.letsplay.booking.BookingRepository;
import com.letsplay.notification.Notification;
import com.letsplay.notification.NotificationRepository;
import com.letsplay.user.User;
import com.letsplay.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class JoinRequestService {

    private final JoinRequestRepository joinRequestRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    public JoinRequestService(JoinRequestRepository joinRequestRepository, BookingRepository bookingRepository,
            UserRepository userRepository, NotificationRepository notificationRepository) {
        this.joinRequestRepository = joinRequestRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    public JoinRequest createRequest(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        User requester = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!booking.getIsPublic()) {
            throw new RuntimeException("Booking is not public");
        }

        JoinRequest request = new JoinRequest(requester, booking);
        JoinRequest saved = joinRequestRepository.save(request);

        // Notify Host
        createNotification(booking.getUser(), "New Join Request",
                requester.getName() + " wants to join your booking at " + booking.getGround().getName());

        return saved;
    }

    @Transactional
    public JoinRequest respondToRequest(Long requestId, JoinRequest.RequestStatus status) {
        JoinRequest request = joinRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus(status);
        JoinRequest updated = joinRequestRepository.save(request);

        if (status == JoinRequest.RequestStatus.ACCEPTED) {
            // Update Booking Count
            Booking booking = request.getBooking();
            if (booking.getJoinedPlayers() < booking.getMaxPlayers()) {
                booking.setJoinedPlayers(booking.getJoinedPlayers() + 1);
                bookingRepository.save(booking);

                // Notify Requester
                createNotification(request.getRequester(), "Request Accepted",
                        "Your request to join " + booking.getGround().getName() + " has been accepted!");
            } else {
                throw new RuntimeException("Booking is full");
            }
        } else if (status == JoinRequest.RequestStatus.REJECTED) {
            // Notify Requester
            createNotification(request.getRequester(), "Request Rejected",
                    "Your request to join " + request.getBooking().getGround().getName() + " was rejected.");
        }

        return updated;
    }

    public List<JoinRequest> getRequestsForBooking(Long bookingId) {
        return joinRequestRepository.findByBookingId(bookingId);
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    private void createNotification(User user, String title, String message) {
        Notification notification = new Notification(user, title, message);
        notificationRepository.save(notification);
    }
}
