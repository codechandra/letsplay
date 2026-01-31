package com.letsplay.rating;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    @Autowired
    private RatingRepository ratingRepository;

    @PostMapping
    public ResponseEntity<Rating> submitRating(@RequestBody Rating rating) {
        // In a real app, validate that reviewer was in the same booking as reviewee
        return ResponseEntity.ok(ratingRepository.save(rating));
    }

    @GetMapping("/user/{userId}")
    public List<Rating> getUserRatings(@PathVariable Long userId) {
        return ratingRepository.findByRevieweeId(userId);
    }
}
