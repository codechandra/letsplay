package com.letsplay.chat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Controller
@RestController // Hybrid controller for both WebSocket and REST
public class ChatController {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    // WebSocket Handling
    @MessageMapping("/chat/{bookingId}")
    @SendTo("/topic/booking/{bookingId}")
    public ChatMessage sendMessage(@DestinationVariable Long bookingId, @Payload ChatMessage chatMessage) {
        chatMessage.setBookingId(bookingId);
        // Ensure timestamp is set
        if (chatMessage.getTimestamp() == null) {
            chatMessage.setTimestamp(java.time.LocalDateTime.now());
        }
        return chatMessageRepository.save(chatMessage);
    }

    // REST API for History
    @GetMapping("/api/chat/{bookingId}")
    @ResponseBody
    public List<ChatMessage> getChatHistory(@PathVariable Long bookingId) {
        return chatMessageRepository.findByBookingIdOrderByTimestampAsc(bookingId);
    }
}
