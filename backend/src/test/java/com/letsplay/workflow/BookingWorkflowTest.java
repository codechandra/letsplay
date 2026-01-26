package com.letsplay.workflow;

import io.temporal.client.WorkflowOptions;
import io.temporal.testing.TestWorkflowEnvironment;
import io.temporal.worker.Worker;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

public class BookingWorkflowTest {

    private TestWorkflowEnvironment testEnv;
    private Worker worker;
    private BookingWorkflow workflow;

    @BeforeEach
    public void setUp() {
        testEnv = TestWorkflowEnvironment.newInstance();
        worker = testEnv.newWorker("BookingTaskQueue");
        workflow = testEnv.getWorkflowClient().newWorkflowStub(BookingWorkflow.class,
                WorkflowOptions.newBuilder().setTaskQueue("BookingTaskQueue").build());
    }

    @AfterEach
    public void tearDown() {
        testEnv.close();
    }

    @Test
    public void testSuccessfulBooking() {
        // Use Manual Stub
        BookingActivitiesStub activities = new BookingActivitiesStub();
        worker.registerActivitiesImplementations(activities);

        testEnv.start();

        // Execution
        workflow.processBooking(1L);

        // Verification
        Assertions.assertTrue(activities.invokedMethods.contains("validateBooking"));
        Assertions.assertTrue(activities.invokedMethods.contains("reserveGround"));
        Assertions.assertTrue(activities.invokedMethods.contains("processPayment"));
        Assertions.assertTrue(activities.invokedMethods.contains("confirmBooking"));
    }

    // Manual Stub to avoid Mockito/Temporal annotation conflicts
    static class BookingActivitiesStub implements BookingActivities {
        public List<String> invokedMethods = new ArrayList<>();

        @Override
        public void validateBooking(Long bookingId) {
            invokedMethods.add("validateBooking");
        }

        @Override
        public void reserveGround(Long bookingId) {
            invokedMethods.add("reserveGround");
        }

        @Override
        public void processPayment(Long bookingId) {
            invokedMethods.add("processPayment");
        }

        @Override
        public void confirmBooking(Long bookingId) {
            invokedMethods.add("confirmBooking");
        }

        @Override
        public void markBookingFailed(Long bookingId, String reason) {
            invokedMethods.add("markBookingFailed");
        }
    }
}
