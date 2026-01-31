package com.letsplay.admin;

import com.letsplay.ground.Ground;
import com.letsplay.ground.GroundRepository;
import com.letsplay.user.User;
import com.letsplay.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private GroundRepository groundRepository;

    @Autowired
    private UserRepository userRepository;

    // --- Grounds Management ---

    @GetMapping("/grounds")
    public List<Ground> getAllGrounds() {
        return groundRepository.findAll();
    }

    @PostMapping("/grounds")
    public ResponseEntity<Ground> createGround(@RequestBody Ground ground) {
        // Ensure owner exists
        if (ground.getOwner() != null && ground.getOwner().getId() != null) {
            Optional<User> owner = userRepository.findById(ground.getOwner().getId());
            if (owner.isPresent()) {
                ground.setOwner(owner.get());
            } else {
                return ResponseEntity.badRequest().build();
            }
        } else {
            return ResponseEntity.badRequest().build();
        }

        Ground savedGround = groundRepository.save(ground);
        return ResponseEntity.ok(savedGround);
    }

    @PutMapping("/grounds/{id}")
    public ResponseEntity<Ground> updateGround(@PathVariable Long id, @RequestBody Ground groundDetails) {
        return groundRepository.findById(id)
                .map(ground -> {
                    ground.setName(groundDetails.getName());
                    ground.setLocation(groundDetails.getLocation());
                    ground.setSportType(groundDetails.getSportType());
                    ground.setDescription(groundDetails.getDescription());
                    ground.setPricePerHour(groundDetails.getPricePerHour());
                    ground.setImageUrl(groundDetails.getImageUrl());

                    // Update owner if provided
                    if (groundDetails.getOwner() != null && groundDetails.getOwner().getId() != null) {
                        userRepository.findById(groundDetails.getOwner().getId()).ifPresent(ground::setOwner);
                    }

                    return ResponseEntity.ok(groundRepository.save(ground));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/grounds/{id}")
    public ResponseEntity<Void> deleteGround(@PathVariable Long id) {
        if (groundRepository.existsById(id)) {
            groundRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // --- User Management ---

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
