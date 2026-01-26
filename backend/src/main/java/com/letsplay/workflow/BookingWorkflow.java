package com.letsplay.workflow;

import io.temporal.workflow.WorkflowInterface;
import io.temporal.workflow.WorkflowMethod;

@WorkflowInterface
public interface BookingWorkflow {
    @WorkflowMethod
    void processBooking(Long bookingId);
}
