package com.letsplay.common;

import com.letsplay.ground.Ground;
import com.letsplay.ground.GroundRepository;
import com.letsplay.user.User;
import com.letsplay.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Set;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final GroundRepository groundRepository;

    public DataSeeder(UserRepository userRepository, GroundRepository groundRepository) {
        this.userRepository = userRepository;
        this.groundRepository = groundRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Create Default User
        if (userRepository.count() == 0) {
            User user = new User();
            user.setName("letsplay User");
            user.setEmail("user@letsplay.com");
            user.setPassword("password");
            user.setRoles(Collections.singleton(User.Role.USER));
            userRepository.save(user);

            User owner = new User();
            owner.setName("Ground Owner");
            owner.setEmail("owner@letsplay.com");
            owner.setPassword("password");
            owner.setRoles(Collections.singleton(User.Role.GROUND_OWNER));
            userRepository.save(owner);

            User coach = new User();
            coach.setName("Pro Coach");
            coach.setEmail("coach@letsplay.com");
            coach.setPassword("password");
            coach.setRoles(Collections.singleton(User.Role.COACH));
            userRepository.save(coach);

            User admin = new User();
            admin.setName("System Admin");
            admin.setEmail("admin@letsplay.com");
            admin.setPassword("admin123");
            admin.setRoles(Collections.singleton(User.Role.ADMIN));
            userRepository.save(admin);

            System.out.println("Seeded Multi-role Users including Admin");
        }

        // 2. Create Default Grounds
        if (groundRepository.count() == 0) {
            User owner = userRepository.findAll().get(0);

            createGround("Play Arena - Sarjapur", "Sarjapur Road", "Football", 1200.0,
                    "https://images.unsplash.com/photo-1529900748604-07564a03e7a6", owner);
            createGround("Active Sports Hub", "Indiranagar", "Cricket", 1500.0,
                    "https://images.unsplash.com/photo-1531415074968-036ba1b575da", owner);
            createGround("Turf Park", "Koramangala", "Football", 800.0,
                    "https://images.unsplash.com/photo-1459865264687-595d652de67e", owner);
            createGround("Smash Bounce", "HSR Layout", "Badminton", 600.0,
                    "https://images.unsplash.com/photo-1626248801379-51a0748a5f96", owner);

            // New Grounds
            createGround("Grand Slam Tennis", "Whitefield", "Tennis", 1000.0,
                    "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0", owner);
            createGround("Dunk Yard", "JP Nagar", "Basketball", 900.0,
                    "https://images.unsplash.com/photo-1546519638-68e109498ee3", owner);
            createGround("Blue Waves Centre", "Bannerghatta", "Swimming", 400.0,
                    "https://images.unsplash.com/photo-1530549387789-4c1017266635", owner);
            createGround("Shuttle Zone Pro", "Marathahalli", "Badminton", 650.0,
                    "https://images.unsplash.com/photo-1613918108466-292b78a8ef95", owner);

            System.out.println("Seeded Default Grounds");
        }
    }

    private void createGround(String name, String location, String sport, Double price, String img, User owner) {
        Ground ground = new Ground();
        ground.setName(name);
        ground.setLocation(location);
        ground.setSportType(sport);
        ground.setPricePerHour(price);
        ground.setImageUrl(img);
        ground.setOwner(owner);
        groundRepository.save(ground);
    }
}
