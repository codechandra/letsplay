package com.letsplay.booking;

import com.letsplay.ground.Ground;
import com.letsplay.user.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "ground_id", nullable = false)
    private Ground ground;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    private String temporalWorkflowId;

    private Boolean isPublic = false;
    private Integer maxPlayers = 1;
    private Integer joinedPlayers = 1;

    private Double totalAmount;
    private Boolean paymentSettled = false;

    public enum BookingStatus {
        PENDING,
        CONFIRMED,
        CANCELLED,
        FAILED
    }

    public Booking() {
    }

    public Booking(Long id, User user, Ground ground, LocalDateTime startTime, LocalDateTime endTime,
            BookingStatus status, String temporalWorkflowId) {
        this.id = id;
        this.user = user;
        this.ground = ground;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
        this.temporalWorkflowId = temporalWorkflowId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Ground getGround() {
        return ground;
    }

    public void setGround(Ground ground) {
        this.ground = ground;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public String getTemporalWorkflowId() {
        return temporalWorkflowId;
    }

    public void setTemporalWorkflowId(String temporalWorkflowId) {
        this.temporalWorkflowId = temporalWorkflowId;
    }

    public Boolean getIsPublic() {
        return isPublic;
    }

    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }

    public Integer getMaxPlayers() {
        return maxPlayers;
    }

    public void setMaxPlayers(Integer maxPlayers) {
        this.maxPlayers = maxPlayers;
    }

    public Integer getJoinedPlayers() {
        return joinedPlayers;
    }

    public void setJoinedPlayers(Integer joinedPlayers) {
        this.joinedPlayers = joinedPlayers;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Boolean getPaymentSettled() {
        return paymentSettled;
    }

    public void setPaymentSettled(Boolean paymentSettled) {
        this.paymentSettled = paymentSettled;
    }
}
