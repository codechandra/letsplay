package com.letsplay.rating;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ratings")
public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long reviewerId; // Who gave the rating

    @Column(nullable = false)
    private Long revieweeId; // Who received the rating

    @Column(nullable = false)
    private Long bookingId; // Context

    private int score; // 1-5

    @Column(length = 500)
    private String comment;

    private LocalDateTime createdAt;

    public Rating() {
        this.createdAt = LocalDateTime.now();
    }

    public Rating(Long reviewerId, Long revieweeId, Long bookingId, int score, String comment) {
        this.reviewerId = reviewerId;
        this.revieweeId = revieweeId;
        this.bookingId = bookingId;
        this.score = score;
        this.comment = comment;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getReviewerId() {
        return reviewerId;
    }

    public void setReviewerId(Long reviewerId) {
        this.reviewerId = reviewerId;
    }

    public Long getRevieweeId() {
        return revieweeId;
    }

    public void setRevieweeId(Long revieweeId) {
        this.revieweeId = revieweeId;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
