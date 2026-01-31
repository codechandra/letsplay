import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../utils/apiConfig';
import ChatWindow from '../components/Chat/ChatWindow';
import { MessageSquare, Calendar, MapPin, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface Booking {
    id: number;
    groundName: string;
    groundLocation: string;
    imageUrl: string;
    startTime: string;
    endTime: string;
    status: string;
}

export default function ChatPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch(`${API_BASE_URL}/bookings/my?email=${user.email}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setBookings(data);
                setLoading(false);
                if (data.length > 0) {
                    // Select first active booking by default or none
                    setSelectedBookingId(data[0].id);
                }
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [user.email]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-12 h-12 text-letsplay-blue animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-letsplay-blue" />
                Your Chats
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
                {/* Booking List */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                    <div className="p-4 bg-slate-50 border-b font-bold text-slate-700">
                        Active Matches
                    </div>
                    <div className="overflow-y-auto flex-1 p-2 space-y-2">
                        {bookings.length === 0 ? (
                            <div className="p-4 text-center text-slate-500 text-sm">
                                No bookings found.
                                <br />
                                <Button variant="link" onClick={() => navigate('/venues')}>Book a game</Button>
                            </div>
                        ) : (
                            bookings.map(booking => (
                                <button
                                    key={booking.id}
                                    onClick={() => setSelectedBookingId(booking.id)}
                                    className={`w-full text-left p-3 rounded-lg border transition-all flex gap-3 ${selectedBookingId === booking.id
                                            ? 'bg-letsplay-blue/5 border-letsplay-blue'
                                            : 'border-transparent hover:bg-slate-50'
                                        }`}
                                >
                                    <div className="w-12 h-12 rounded-lg bg-slate-200 overflow-hidden flex-shrink-0">
                                        <img src={booking.imageUrl || 'https://via.placeholder.com/100'} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-sm truncate">{booking.groundName}</h4>
                                        <div className="flex items-center text-xs text-slate-500 mt-1">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            {new Date(booking.startTime).toLocaleDateString()}
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                    {selectedBookingId ? (
                        <ChatWindow
                            bookingId={selectedBookingId}
                            currentUser={{ id: user.id || 0, name: user.name || 'User' }}
                        />
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-400">
                            Select a match to start chatting
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
