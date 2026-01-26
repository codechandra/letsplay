package com.letsplay.workflow;

import io.temporal.activity.ActivityOptions;
import io.temporal.common.RetryOptions;
import io.temporal.workflow.Workflow;

import java.time.Duration;

public class BookingWorkflowImpl implements BookingWorkflow {

    private final BookingActivities activities = Workflow.newActivityStub(BookingActivities.class,
            ActivityOptions.newBuilder()
                    .setStartToCloseTimeout(Duration.ofMinutes(1))
                    .setRetryOptions(RetryOptions.newBuilder().setMaximumAttempts(3).build())
                    .build());

    @Override
    public void processBooking(Long bookingId) {
        // Set Search Attributes for Advanced Visibility (Labs)
        java.util.Map<String, Object> attributes = new java.util.HashMap<>();
        attributes.put("CustomKeywordField", "booking-" + bookingId);
        Workflow.upsertSearchAttributes(attributes);

        try {
            activities.validateBooking(bookingId);
            activities.reserveGround(bookingId);
            activities.processPayment(bookingId);
            activities.confirmBooking(bookingId);
        } catch (Exception e) {
            activities.markBookingFailed(bookingId, e.getMessage());
            throw e;
        }
    }
}
