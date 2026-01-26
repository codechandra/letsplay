package com.letsplay.common;

import com.letsplay.workflow.BookingActivitiesImpl;
import com.letsplay.workflow.BookingWorkflowImpl;
import io.temporal.client.WorkflowClient;
import io.temporal.serviceclient.WorkflowServiceStubs;
import io.temporal.serviceclient.WorkflowServiceStubsOptions;
import io.temporal.worker.Worker;
import io.temporal.worker.WorkerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import jakarta.annotation.PostConstruct;

@Configuration
public class TemporalConfig {

    @Value("${temporal.target}")
    private String temporalTarget;

    private final BookingActivitiesImpl bookingActivities;

    public TemporalConfig(BookingActivitiesImpl bookingActivities) {
        this.bookingActivities = bookingActivities;
    }

    @Bean
    public WorkflowServiceStubs workflowServiceStubs() {
        return WorkflowServiceStubs.newServiceStubs(
                WorkflowServiceStubsOptions.newBuilder().setTarget(temporalTarget).build());
    }

    @Bean
    public WorkflowClient workflowClient(WorkflowServiceStubs serviceStubs) {
        return WorkflowClient.newInstance(serviceStubs);
    }

    @Bean
    public WorkerFactory workerFactory(WorkflowClient workflowClient) {
        return WorkerFactory.newInstance(workflowClient);
    }

    @PostConstruct
    public void startWorker() {
        // In a real app, this might be separated or conditional
        new Thread(() -> {
            try {
                // Wait for Spring Context to be ready
                WorkflowServiceStubs serviceStubs = workflowServiceStubs();
                WorkflowClient client = workflowClient(serviceStubs);
                WorkerFactory factory = workerFactory(client);

                Worker worker = factory.newWorker("BookingTaskQueue");
                worker.registerWorkflowImplementationTypes(BookingWorkflowImpl.class);
                worker.registerActivitiesImplementations(bookingActivities);

                factory.start();
                System.out.println("Temporal Worker started...");
            } catch (Exception e) {
                System.err.println("Failed to start Temporal Worker: " + e.getMessage());
            }
        }).start();
    }
}
