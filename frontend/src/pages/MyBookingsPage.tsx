import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../utils/apiConfig';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, Loader2, Users } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';

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
}

export default function MyBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

    useEffect(() => {
        // In a real app, fetch user's bookings
        // For now, fetch all bookings as demo
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-12 h-12 text-letsplay-blue animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="container mx-auto px-4 py-6 lg:py-12">
                {/* Header */}
                <div className="mb-6 lg:mb-8">
                    <h1 className="text-2xl lg:text-4xl font-black text-slate-900 mb-2">
                        My Bookings
                    </h1>
                    <p className="text-slate-500 text-sm lg:text-base">
                        View and manage your venue bookings
                    </p>
                </div>

                {/* Filters - Responsive */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {['all', 'upcoming', 'past'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={cn(
                                "px-4 lg:px-6 py-2 rounded-lg font-bold text-sm lg:text-base whitespace-nowrap transition-all",
                                filter === f
                                    ? "bg-letsplay-blue text-white"
                                    : "bg-white text-slate-600 hover:bg-slate-100"
                            )}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Bookings List */}
                {bookings.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 lg:p-20 text-center">
                        <Calendar className="w-16 h-16 lg:w-20 lg:h-20 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-2">
                            No bookings yet
                        </h3>
                        <p className="text-slate-500 mb-6">
                            Start booking your favorite sports venues
                        </p>
                        <Button onClick={() => window.location.href = '/venues'}>
                            Browse Venues
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 lg:gap-6">
                        {bookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="bg-white rounded-xl lg:rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="flex flex-col sm:flex-row">
                                    {/* Image - Full width on mobile, fixed width on desktop */}
                                    <div className="w-full sm:w-48 lg:w-64 h-48 sm:h-auto flex-shrink-0">
                                        <img
                                            src={booking.ground.imageUrl}
                                            alt={booking.ground.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-4 lg:p-6">
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
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
                                                <h3 className="text-lg lg:text-xl font-bold text-slate-900 mb-1">
                                                    {booking.ground.name}
                                                </h3>
                                                <p className="text-sm text-slate-500 flex items-center">
                                                    <MapPin className="w-4 h-4 mr-1" />
                                                    {booking.ground.location}
                                                </p>
                                            </div>

                                            {/* Booking ID - Desktop */}
                                            <div className="hidden sm:block text-right">
                                                <p className="text-xs text-slate-400 uppercase">Booking ID</p>
                                                <p className="text-lg font-black text-slate-900">#{booking.id}</p>
                                            </div>
                                        </div>

                                        {/* Date & Time */}
                                        <div className="grid grid-cols-2 gap-3 lg:gap-4 mb-4">
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
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t">
                                            {booking.isPublic && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Users className="w-4 h-4 text-letsplay-blue" />
                                                    <span className="font-medium">
                                                        {booking.joinedPlayers}/{booking.maxPlayers} players
                                                    </span>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-3">
                                                {booking.totalAmount && (
                                                    <div className="text-right">
                                                        <p className="text-xs text-slate-400">Total</p>
                                                        <p className="text-lg lg:text-xl font-bold text-letsplay-blue">
                                                            ₹{booking.totalAmount}
                                                        </p>
                                                    </div>
                                                )}

                                                {booking.status === 'CONFIRMED' && (
                                                    <Button size="sm" variant="outline" className="whitespace-nowrap">
                                                        View Details
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Mobile Booking ID */}
                                        <div className="sm:hidden mt-3 pt-3 border-t text-center">
                                            <p className="text-xs text-slate-400">Booking ID: <span className="font-bold text-slate-900">#{booking.id}</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
