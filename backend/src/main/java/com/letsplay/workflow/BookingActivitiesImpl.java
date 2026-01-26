package com.letsplay.workflow;

import com.letsplay.booking.Booking;
import com.letsplay.booking.BookingRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class BookingActivitiesImpl implements BookingActivities {

    private final BookingRepository bookingRepository;

    public BookingActivitiesImpl(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @Override
    public void validateBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + bookingId));
        if (booking.getStatus() != Booking.BookingStatus.PENDING) {
            throw new RuntimeException("Booking is not in PENDING state");
        }
        // Logic to check ground availability (overlapping bookings) would go here
    }

    @Override
    @Transactional
    public void reserveGround(Long bookingId) {
        // Logic to lock the slot
        System.out.println("Reserving ground for booking: " + bookingId);
    }

    @Override
    public void processPayment(Long bookingId) {
        // Mock payment processing
        System.out.println("Processing payment for booking: " + bookingId);
        try {
            // Simulate payment processing delay
            Thread.sleep(3000);

            Booking booking = bookingRepository.findById(bookingId).get();
            booking.setPaymentSettled(true);
            bookingRepository.save(booking);

            System.out.println("Payment settled for booking: " + bookingId);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    @Override
    @Transactional
    public void confirmBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId).get();
        booking.setStatus(Booking.BookingStatus.CONFIRMED);
        bookingRepository.save(booking);
        System.out.println("Booking confirmed: " + bookingId);
    }

    @Override
    @Transactional
    public void markBookingFailed(Long bookingId, String reason) {
        Booking booking = bookingRepository.findById(bookingId).orElse(null);
        if (booking != null) {
            booking.setStatus(Booking.BookingStatus.FAILED);
            bookingRepository.save(booking);
        }
        System.out.println("Booking failed: " + bookingId + " Reason: " + reason);
    }
}
