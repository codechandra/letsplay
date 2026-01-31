package com.letsplay.join;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/requests")
public class JoinRequestController {

    private final JoinRequestService joinRequestService;

    public JoinRequestController(JoinRequestService joinRequestService) {
        this.joinRequestService = joinRequestService;
    }

    @PostMapping("/{id}/respond")
    public ResponseEntity<JoinRequest> respondToRequest(@PathVariable Long id,
            @RequestParam JoinRequest.RequestStatus status) {
        return ResponseEntity.ok(joinRequestService.respondToRequest(id, status));
    }
}
