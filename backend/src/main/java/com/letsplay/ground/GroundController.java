package com.letsplay.ground;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grounds")
@CrossOrigin(origins = "http://localhost:5173")
public class GroundController {

    private final GroundRepository groundRepository;

    public GroundController(GroundRepository groundRepository) {
        this.groundRepository = groundRepository;
    }

    @GetMapping
    public ResponseEntity<List<Ground>> getAllGrounds(@RequestParam(required = false) String sportType) {
        if (sportType != null) {
            return ResponseEntity.ok(groundRepository.findAll().stream()
                    .filter(g -> g.getSportType().equalsIgnoreCase(sportType))
                    .toList());
        }
        return ResponseEntity.ok(groundRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ground> getGroundById(@PathVariable Long id) {
        return groundRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
