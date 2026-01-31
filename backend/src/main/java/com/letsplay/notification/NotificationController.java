package com.letsplay.notification;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final com.letsplay.join.JoinRequestService joinRequestService;

    public NotificationController(com.letsplay.join.JoinRequestService joinRequestService) {
        this.joinRequestService = joinRequestService;
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getUserNotifications(@RequestParam Long userId) {
        return ResponseEntity.ok(joinRequestService.getUserNotifications(userId));
    }
}
