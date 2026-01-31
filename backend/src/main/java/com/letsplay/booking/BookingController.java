package com.letsplay.booking;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final com.letsplay.join.JoinRequestService joinRequestService;

    public BookingController(BookingService bookingService, com.letsplay.join.JoinRequestService joinRequestService) {
        this.bookingService = bookingService;
        this.joinRequestService = joinRequestService;
    }

    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking) {
        return ResponseEntity.ok(bookingService.createBooking(booking));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBooking(@PathVariable Long id) {
        return bookingService.getBooking(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<java.util.List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/public")
    public ResponseEntity<java.util.List<Booking>> getPublicBookings() {
        return ResponseEntity.ok(bookingService.getPublicBookings());
    }

    // Changed to create a request
    @PostMapping("/{id}/join")
    public ResponseEntity<?> joinBooking(@PathVariable Long id, @RequestParam Long userId) {
        return ResponseEntity.ok(joinRequestService.createRequest(id, userId));
    }

    @GetMapping("/{id}/requests")
    public ResponseEntity<java.util.List<com.letsplay.join.JoinRequest>> getBookingRequests(@PathVariable Long id) {
        return ResponseEntity.ok(joinRequestService.getRequestsForBooking(id));
    }

    @GetMapping("/slots")
    public ResponseEntity<java.util.List<Booking>> getSlots(@RequestParam Long groundId,
            @RequestParam @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate date) {
        return ResponseEntity.ok(bookingService.getBookedSlots(groundId, date));
    }
}
