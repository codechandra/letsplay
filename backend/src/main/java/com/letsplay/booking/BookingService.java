package com.letsplay.booking;

import com.letsplay.workflow.BookingWorkflow;
import io.temporal.client.WorkflowClient;
import io.temporal.client.WorkflowOptions;
import org.springframework.stereotype.Service;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final WorkflowClient workflowClient;

    public BookingService(BookingRepository bookingRepository, WorkflowClient workflowClient) {
        this.bookingRepository = bookingRepository;
        this.workflowClient = workflowClient;
    }

    public Booking createBooking(Booking booking) {
        booking.setStatus(Booking.BookingStatus.PENDING);
        Booking savedBooking = bookingRepository.save(booking);

        // Start Temporal Workflow
        BookingWorkflow workflow = workflowClient.newWorkflowStub(BookingWorkflow.class,
                WorkflowOptions.newBuilder()
                        .setTaskQueue("BookingTaskQueue")
                        .setWorkflowId("booking-" + savedBooking.getId())
                        .build());

        // Asynchronously start the workflow
        WorkflowClient.start(workflow::processBooking, savedBooking.getId());

        savedBooking.setTemporalWorkflowId("booking-" + savedBooking.getId());
        return bookingRepository.save(savedBooking);
    }

    public java.util.Optional<Booking> getBooking(Long id) {
        return bookingRepository.findById(id);
    }

    public java.util.List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public java.util.List<Booking> getPublicBookings() {
        return bookingRepository.findAll().stream()
                .filter(b -> b.getIsPublic() && b.getStatus() == Booking.BookingStatus.CONFIRMED
                        && b.getJoinedPlayers() < b.getMaxPlayers())
                .toList();
    }

    public Booking joinBooking(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getIsPublic()) {
            throw new RuntimeException("This booking is not public");
        }

        if (booking.getJoinedPlayers() >= booking.getMaxPlayers()) {
            throw new RuntimeException("Booking is full");
        }

        booking.setJoinedPlayers(booking.getJoinedPlayers() + 1);
        return bookingRepository.save(booking);
    }
}
