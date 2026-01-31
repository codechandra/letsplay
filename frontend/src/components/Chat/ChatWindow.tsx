import { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import { Send, MessageSquare } from 'lucide-react';
import { API_BASE_URL } from '../../utils/apiConfig';

interface ChatWindowProps {
    bookingId: number;
    currentUser: { id: number; name: string };
}

interface Message {
    id?: number;
    senderId: number;
    senderName: string;
    content: string;
    timestamp?: string;
}

export default function ChatWindow({ bookingId, currentUser }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [connected, setConnected] = useState(false);
    const clientRef = useRef<Client | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 1. Load History
    useEffect(() => {
        fetch(`${API_BASE_URL}/api/chat/${bookingId}`)
            .then(res => res.json())
            .then(data => setMessages(data))
            .catch(err => console.error("Failed to load chat history", err));
    }, [bookingId]);

    // 2. Connect WebSocket
    useEffect(() => {
        const client = new Client({
            brokerURL: 'ws://localhost:8080/ws', // Native WebSocket
            // If using SockJS fallback, we'd need a factory. For modern browsers, straight WS is fine.
            // But since we configured .withSockJS() in backend, we should use SockKS or standard WS url mapping
            // Note: Spring Boot's SockJS endpoint usually falls back to WS at /ws/websocket

            // For simplicity in this demo, accessing the WS endpoint directly:
            // If backend is ws://localhost:8080/ws

            onConnect: () => {
                setConnected(true);
                client.subscribe(`/topic/booking/${bookingId}`, (message) => {
                    const receivedMsg = JSON.parse(message.body);
                    setMessages(prev => [...prev, receivedMsg]);
                });
            },
            onDisconnect: () => setConnected(false),
        });

        // Use SockJS fallback if needed, but trying direct WS first for simplicity with @stomp/stompjs
        // Ideally: webSocketFactory: () => new SockJS('http://localhost:8080/ws')

        // Let's rely on standard WS for now. If issues, we can add sockjs-client factory
        client.webSocketFactory = () => new WebSocket('ws://localhost:8080/ws');

        client.activate();
        clientRef.current = client;

        return () => {
            client.deactivate();
        };
    }, [bookingId]);

    // 3. Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!newMessage.trim() || !clientRef.current || !connected) return;

        const payload = {
            senderId: currentUser.id,
            senderName: currentUser.name,
            content: newMessage,
            bookingId: bookingId
        };

        clientRef.current.publish({
            destination: `/app/chat/${bookingId}`,
            body: JSON.stringify(payload)
        });

        setNewMessage('');
    };

    return (
        <div className="flex flex-col h-[500px] bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
            {/* Header */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MessageSquare size={18} />
                    <span className="font-bold">Match Chat</span>
                </div>
                <div className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400' : 'bg-red-400'}`} />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {messages.map((msg, idx) => {
                    const isMe = msg.senderId === currentUser.id;
                    return (
                        <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-xl p-3 ${isMe ? 'bg-letsplay-blue text-white' : 'bg-white border text-slate-800'
                                }`}>
                                {!isMe && <p className="text-xs text-slate-400 mb-1 font-bold">{msg.senderName}</p>}
                                <p className="text-sm">{msg.content}</p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t bg-white flex gap-2">
                <input
                    type="text"
                    className="flex-1 bg-slate-100 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-letsplay-blue"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                />
                <button
                    onClick={handleSend}
                    disabled={!connected || !newMessage.trim()}
                    className="p-2 bg-letsplay-blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
}
