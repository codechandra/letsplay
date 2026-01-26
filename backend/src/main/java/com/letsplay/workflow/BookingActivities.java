package com.letsplay.workflow;

import io.temporal.activity.ActivityInterface;
import io.temporal.activity.ActivityMethod;

@ActivityInterface
public interface BookingActivities {
    @ActivityMethod
    void validateBooking(Long bookingId);

    @ActivityMethod
    void reserveGround(Long bookingId);

    @ActivityMethod
    void processPayment(Long bookingId);

    @ActivityMethod
    void confirmBooking(Long bookingId);

    @ActivityMethod
    void markBookingFailed(Long bookingId, String reason);
}
