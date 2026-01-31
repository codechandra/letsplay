import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../utils/apiConfig';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, Loader2, Users, Star } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';
import { RatingModal } from '../../components/Rating/RatingModal';

interface Booking {
    id: number;
    ground: {
        id: number;
        name: string;
        location: string;
        sportType: string;
        imageUrl: string;
    };
    startTime: string;
    endTime: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'FAILED';
    totalAmount: number;
    isPublic: boolean;
    maxPlayers: number;
    joinedPlayers: number;
    players?: { id: number; name: string }[]; // Optional until fetched
}

export default function PlayerBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');

    // Rating Modal State
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
    const [ratingPlayers, setRatingPlayers] = useState<{ id: number; name: string }[]>([]);

    useEffect(() => {
        fetch(`${API_BASE_URL}/bookings`)
            .then(res => res.json())
            .then(data => {
                setBookings(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleRateClick = async (bookingId: number) => {
        // Fetch detailed booking info to get players
        // Note: In real app, /bookings list might not return all players, so we fetch detail
        try {
            const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}`);
            if (res.ok) {
                const data = await res.json();
                // Fallback if API doesn't return players yet, allow rating empty list or mock
                const players = data.players || [];
                setRatingPlayers(players);
                setSelectedBookingId(bookingId);
                setIsRatingModalOpen(true);
            }
        } catch (error) {
            console.error("Failed to fetch booking details", error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'text-green-600 bg-green-50 border-green-200';
            case 'PENDING': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'CANCELLED': return 'text-red-600 bg-red-50 border-red-200';
            case 'FAILED': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-slate-600 bg-slate-50 border-slate-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return <CheckCircle className="w-4 h-4" />;
            case 'PENDING': return <Loader2 className="w-4 h-4 animate-spin" />;
            default: return <XCircle className="w-4 h-4" />;
        }
    };

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <Loader2 className="w-12 h-12 text-letsplay-blue animate-spin" />
            </div>
        );
    }

    // Filter logic
    const filteredBookings = bookings.filter(b => {
        const isPast = new Date(b.endTime) < new Date();
        if (filter === 'upcoming') return !isPast;
        if (filter === 'past') return isPast;
        return true;
    });

    return (
        <div className="space-y-6">
            <RatingModal
                isOpen={isRatingModalOpen}
                onClose={() => setIsRatingModalOpen(false)}
                bookingId={selectedBookingId || 0}
                players={ratingPlayers}
                currentUser={{ id: currentUser.id || 0 }}
            />

            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">My Bookings</h1>
                <p className="text-slate-500">Manage all your venue reservations</p>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {['all', 'upcoming', 'past'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={cn(
                            "px-4 py-2 rounded-lg font-bold text-sm transition-all",
                            filter === f
                                .toLowerCase()
                                ? "bg-letsplay-blue text-white"
                                : "bg-white text-slate-600 hover:bg-slate-100"
                        )}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* Bookings List */}
            {filteredBookings.length === 0 ? (
                <div className="bg-white rounded-2xl p-20 text-center">
                    <Calendar className="w-20 h-20 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                        No bookings found
                    </h3>
                    <p className="text-slate-500 mb-6">
                        {filter === 'upcoming'
                            ? "You don't have any upcoming games"
                            : "No booking history found"}
                    </p>
                    <Button onClick={() => window.location.href = '/venues'}>
                        Browse Venues
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredBookings.map((booking) => {
                        const isPast = new Date(booking.endTime) < new Date();
                        return (
                            <div
                                key={booking.id}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="flex flex-col lg:flex-row">
                                    {/* Image */}
                                    <div className="w-full lg:w-48 h-32 lg:h-auto flex-shrink-0">
                                        <img
                                            src={booking.ground.imageUrl}
                                            alt={booking.ground.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="px-2 py-1 bg-letsplay-blue/10 text-letsplay-blue text-xs font-bold rounded">
                                                        {booking.ground.sportType}
                                                    </span>
                                                    <span className={cn(
                                                        "px-2 py-1 text-xs font-bold rounded border flex items-center gap-1",
                                                        getStatusColor(booking.status)
                                                    )}>
                                                        {getStatusIcon(booking.status)}
                                                        {booking.status}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-bold text-slate-900 mb-1">
                                                    {booking.ground.name}
                                                </h3>
                                                <p className="text-sm text-slate-500 flex items-center">
                                                    <MapPin className="w-4 h-4 mr-1" />
                                                    {booking.ground.location}
                                                </p>
                                            </div>

                                            {/* Booking ID */}
                                            <div className="text-right">
                                                <p className="text-xs text-slate-400 uppercase">Booking ID</p>
                                                <p className="text-lg font-black text-slate-900">#{booking.id}</p>
                                            </div>
                                        </div>

                                        {/* Date & Time */}
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="w-4 h-4 text-letsplay-blue" />
                                                <span className="font-medium">
                                                    {new Date(booking.startTime).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Clock className="w-4 h-4 text-letsplay-blue" />
                                                <span className="font-medium">
                                                    {new Date(booking.startTime).toLocaleTimeString('en-IN', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                    {' - '}
                                                    {new Date(booking.endTime).toLocaleTimeString('en-IN', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-4 border-t">
                                            {booking.isPublic && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Users className="w-4 h-4 text-letsplay-blue" />
                                                    <span className="font-medium">
                                                        {booking.joinedPlayers}/{booking.maxPlayers} players
                                                    </span>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-3 ml-auto">
                                                {isPast && booking.status === 'CONFIRMED' && (
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        onClick={() => handleRateClick(booking.id)}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                        Rate Players
                                                    </Button>
                                                )}

                                                {booking.totalAmount && (
                                                    <div className="text-right ml-4">
                                                        <p className="text-xs text-slate-400">Total</p>
                                                        <p className="text-xl font-bold text-letsplay-blue">
                                                            ₹{booking.totalAmount}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
