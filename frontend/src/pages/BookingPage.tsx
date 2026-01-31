import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../utils/apiConfig';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import ChatWindow from '../components/Chat/ChatWindow';
import { Calendar, Clock, MapPin, Loader2, Users, Globe, IndianRupee, ArrowLeft, Share2, Star, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

interface Ground {
    id: number;
    name: string;
    location: string;
    sportType: string;
    description: string;
    pricePerHour: number;
    imageUrl: string;
    owner: {
        id: number;
        name: string;
    };
}

interface Booking {
    id: number;
    startTime: string;
    endTime: string;
    isPublic: boolean;
    maxPlayers: number;
    joinedPlayers?: number;
}

const TIME_SLOTS = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
];

const DURATIONS = [
    { hours: 1, label: '1 Hour' },
    { hours: 2, label: '2 Hours' },
    { hours: 3, label: '3 Hours' }
];

type BookingStatus = 'IDLE' | 'PENDING' | 'CONFIRMED' | 'FAILED';

export function BookingPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [venue, setVenue] = useState<Ground | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date(Date.now() + 86400000));
    const [selectedTime, setSelectedTime] = useState<string>('18:00');
    const [duration, setDuration] = useState<number>(1);
    const [isPublic, setIsPublic] = useState(false);
    const [maxPlayers, setMaxPlayers] = useState(4);
    const [bookedSlots, setBookedSlots] = useState<Booking[]>([]);
    const [joinableBookingId, setJoinableBookingId] = useState<number | null>(null);

    const [bookingStatus, setBookingStatus] = useState<BookingStatus>('IDLE');
    const [bookingError, setBookingError] = useState<string | null>(null);
    const [confirmedBookingId, setConfirmedBookingId] = useState<number | null>(null);

    useEffect(() => {
        if (id && !isNaN(Number(id))) {
            fetch(`${API_BASE_URL}/grounds/${id}`)
                .then(res => res.json())
                .then(data => {
                    setVenue(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [id]);

    useEffect(() => {
        if (venue && selectedDate) {
            // Fix: Use local date string instead of ISO (UTC) to avoid previous day fetch
            const offset = selectedDate.getTimezoneOffset() * 60000;
            const localDate = new Date(selectedDate.getTime() - offset);
            const dateStr = localDate.toISOString().split('T')[0];

            fetch(`${API_BASE_URL}/bookings/slots?groundId=${venue.id}&date=${dateStr}`)
                .then(res => res.json())
                .then(data => setBookedSlots(data))
                .catch(err => console.error("Failed to fetch slots", err));
        }
    }, [venue, selectedDate]);

    // Reset joinable state when date changes
    useEffect(() => {
        setJoinableBookingId(null);
    }, [selectedDate, venue]);

    const getSlotStatus = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':').map(Number);

        // Start time of the proposed slot
        const slotStart = new Date(selectedDate);
        slotStart.setHours(hours, minutes, 0, 0);

        // End time of the proposed slot
        const slotEnd = new Date(slotStart);
        slotEnd.setHours(slotStart.getHours() + duration);

        const overlappingBooking = bookedSlots.find(booking => {
            const bookingStart = new Date(booking.startTime);
            const bookingEnd = new Date(booking.endTime);
            return slotStart < bookingEnd && bookingStart < slotEnd;
        });

        if (!overlappingBooking) return { status: 'AVAILABLE' };

        // Check if joinable
        if (overlappingBooking.isPublic &&
            (overlappingBooking.joinedPlayers || 1) < (overlappingBooking.maxPlayers || 1)) {
            return { status: 'JOINABLE', bookingId: overlappingBooking.id };
        }

        return { status: 'BOOKED' };
    };

    const handleSlotClick = (time: string) => {
        const { status, bookingId } = getSlotStatus(time);

        if (status === 'BOOKED') return;

        setSelectedTime(time);
        if (status === 'JOINABLE') {
            setJoinableBookingId(bookingId!);
        } else {
            setJoinableBookingId(null);
        }
    };

    const createBooking = async (groundId: number, startTime: Date, endTime: Date, isPublic: boolean, maxPlayers: number) => {
        setBookingStatus('PENDING');
        setBookingError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    groundId,
                    startTime: startTime.toISOString(),
                    endTime: endTime.toISOString(),
                    isPublic,
                    maxPlayers
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create booking');
            }

            const data = await response.json();
            setConfirmedBookingId(data.id);
            setBookingStatus('CONFIRMED');
        } catch (err: any) {
            setBookingError(err.message);
            setBookingStatus('FAILED');
        }
    };

    const joinBooking = async (bookingId: number) => {
        setBookingStatus('PENDING');
        setBookingError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({}) // Empty body for join
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to join booking');
            }

            const data = await response.json();
            setConfirmedBookingId(data.id);
            setBookingStatus('CONFIRMED');
        } catch (err: any) {
            setBookingError(err.message);
            setBookingStatus('FAILED');
        }
    };

    const handleConfirmAction = () => {
        if (!venue) return;

        if (joinableBookingId) {
            joinBooking(joinableBookingId);
            return;
        }

        const [hours, minutes] = selectedTime.split(':').map(Number);
        const startTime = new Date(selectedDate);
        startTime.setHours(hours, minutes, 0, 0);

        const endTime = new Date(startTime);
        endTime.setHours(startTime.getHours() + duration);

        createBooking(venue.id, startTime, endTime, isPublic, maxPlayers);
    };

    const totalPrice = venue ? venue.pricePerHour * duration : 0;

    // Generate next 30 days for date selection
    const availableDates = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return date;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-12 h-12 text-letsplay-blue animate-spin" />
            </div>
        );
    }

    if (!venue) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-bold text-slate-900 mb-4">Venue Not Found</h1>
                <Button onClick={() => navigate('/venues')}>Browse Venues</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Mobile Header */}
            <div className="lg:hidden bg-white border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3 flex items-center gap-3">
                    <button onClick={() => navigate('/venues')} className="p-2 -ml-2">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-lg font-bold truncate">{venue.name}</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-4 lg:py-8">
                {/* Desktop Back Button */}
                <Button
                    variant="ghost"
                    className="hidden lg:flex mb-6 pl-0 hover:bg-transparent"
                    onClick={() => navigate('/venues')}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Venues
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-8">
                    {/* Left: Venue Info - Takes 3 columns on desktop */}
                    <div className="lg:col-span-3 space-y-4 lg:space-y-6">
                        {/* Venue Image */}
                        <div className="rounded-xl lg:rounded-2xl overflow-hidden aspect-video shadow-lg">
                            <img
                                src={venue.imageUrl}
                                alt={venue.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Venue Details */}
                        <div className="bg-white p-4 lg:p-6 rounded-xl lg:rounded-2xl shadow-sm">
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div className="flex-1">
                                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
                                        {venue.name}
                                    </h1>
                                    <p className="flex items-center text-slate-600 text-sm lg:text-base">
                                        <MapPin className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-letsplay-blue flex-shrink-0" />
                                        {venue.location}
                                    </p>
                                </div>
                                <div className="bg-letsplay-blue/10 px-3 py-1.5 rounded-lg flex-shrink-0">
                                    <span className="text-xs lg:text-sm font-bold text-letsplay-blue">
                                        {venue.sportType}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <h3 className="text-base lg:text-lg font-bold text-slate-900 mb-2">
                                    About this venue
                                </h3>
                                <p className="text-slate-600 text-sm lg:text-base leading-relaxed">
                                    {venue.description}
                                </p>
                            </div>
                        </div>

                        {/* Host Info */}
                        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm border border-slate-100">
                            <h3 className="font-bold text-lg mb-4">Host</h3>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-letsplay-blue/10 rounded-full flex items-center justify-center text-letsplay-blue font-bold text-xl">
                                    {venue.owner.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">{venue.owner.name}</p>
                                    <p className="text-sm text-slate-500">Venue Owner</p>
                                </div>
                            </div>
                        </div>

                        {/* Chat Window (Only visible if logged in - simplistic check for demo) */}
                        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm border border-slate-100">
                            <h3 className="font-bold text-lg mb-4">Team Chat</h3>
                            {/* Mocking current user for demo. In real app, get from context */}
                            <ChatWindow
                                bookingId={Number(id)}
                                currentUser={{
                                    id: JSON.parse(localStorage.getItem('user') || '{}').id || 999,
                                    name: JSON.parse(localStorage.getItem('user') || '{}').name || 'Anonymous'
                                }}
                            />
                        </div>
                    </div>

                    {/* Right: Booking Form - Takes 2 columns on desktop, sticky */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-4 lg:p-6 rounded-xl lg:rounded-2xl shadow-lg lg:sticky lg:top-24">
                            <AnimatePresence mode="wait">
                                {!bookingStatus || bookingStatus === 'IDLE' ? (
                                    <motion.div
                                        key="booking-form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-lg lg:text-xl font-bold">Book a Slot</h2>
                                            <div className="text-right">
                                                <div className="flex items-center text-2xl lg:text-3xl font-bold text-letsplay-blue">
                                                    <IndianRupee className="w-5 h-5 lg:w-6 lg:h-6" />
                                                    {totalPrice}
                                                </div>
                                                <p className="text-xs text-slate-500">for {duration} hour{duration > 1 ? 's' : ''}</p>
                                            </div>
                                        </div>

                                        {/* Date Selection */}
                                        <div className="mb-6">
                                            <label className="block text-sm font-bold text-slate-700 mb-3">
                                                Select Date
                                            </label>
                                            <div className="grid grid-cols-4 lg:grid-cols-3 gap-2">
                                                {availableDates.slice(0, 12).map((date) => {
                                                    const isSelected = date.toDateString() === selectedDate.toDateString();
                                                    return (
                                                        <button
                                                            key={date.toISOString()}
                                                            onClick={() => setSelectedDate(date)}
                                                            className={cn(
                                                                "p-2 lg:p-3 rounded-lg border-2 transition-all text-center",
                                                                isSelected
                                                                    ? "border-letsplay-blue bg-letsplay-blue text-white"
                                                                    : "border-slate-200 hover:border-letsplay-blue/50"
                                                            )}
                                                        >
                                                            <div className="text-xs font-bold">
                                                                {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                                            </div>
                                                            <div className="text-lg lg:text-xl font-bold">
                                                                {date.getDate()}
                                                            </div>
                                                            <div className="text-xs opacity-75">
                                                                {date.toLocaleDateString('en-US', { month: 'short' })}
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Duration Selection */}
                                        <div className="mb-6">
                                            <label className="block text-sm font-bold text-slate-700 mb-3">
                                                Duration
                                            </label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {DURATIONS.map((d) => (
                                                    <button
                                                        key={d.hours}
                                                        onClick={() => setDuration(d.hours)}
                                                        className={cn(
                                                            "p-3 rounded-lg border-2 font-bold transition-all text-sm lg:text-base",
                                                            duration === d.hours
                                                                ? "border-letsplay-blue bg-letsplay-blue text-white"
                                                                : "border-slate-200 hover:border-letsplay-blue/50"
                                                        )}
                                                    >
                                                        {d.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Time Slot Selection */}
                                        <div className="mb-6">
                                            <label className="block text-sm font-bold text-slate-700 mb-3">
                                                Select Time Slot
                                            </label>

                                            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                                {[
                                                    { label: 'Morning', slots: TIME_SLOTS.filter(t => parseInt(t) < 12) },
                                                    { label: 'Afternoon', slots: TIME_SLOTS.filter(t => parseInt(t) >= 12 && parseInt(t) < 17) },
                                                    { label: 'Evening', slots: TIME_SLOTS.filter(t => parseInt(t) >= 17) }
                                                ].map((group) => (
                                                    <div key={group.label}>
                                                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 ml-1">{group.label}</h4>
                                                        <div className="grid grid-cols-4 lg:grid-cols-3 gap-2">
                                                            {group.slots.map((time) => {
                                                                const isSelected = time === selectedTime;
                                                                const { status } = getSlotStatus(time);
                                                                const isJoinable = status === 'JOINABLE';
                                                                const isBooked = status === 'BOOKED';

                                                                return (
                                                                    <button
                                                                        key={time}
                                                                        disabled={isBooked}
                                                                        onClick={() => handleSlotClick(time)}
                                                                        className={cn(
                                                                            "p-2.5 lg:p-3 rounded-lg border-2 font-bold transition-all text-sm relative overflow-hidden",
                                                                            isSelected
                                                                                ? isJoinable
                                                                                    ? "border-green-500 bg-green-500 text-white"
                                                                                    : "border-letsplay-blue bg-letsplay-blue text-white shadow-lg shadow-indigo-200"
                                                                                : isJoinable
                                                                                    ? "border-green-200 bg-green-50 text-green-700 hover:border-green-500"
                                                                                    : isBooked
                                                                                        ? "border-slate-100 bg-slate-100 text-slate-400 cursor-not-allowed decoration-slice"
                                                                                        : "border-slate-200 hover:border-letsplay-blue/50 hover:bg-indigo-50"
                                                                        )}
                                                                    >
                                                                        {time}
                                                                        {isJoinable && !isSelected && (
                                                                            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-green-500 rounded-full"></span>
                                                                        )}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Social Booking Toggle */}
                                        <div className="mb-6 p-4 bg-slate-50 rounded-xl">
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <p className="font-bold text-sm">Make Booking Public</p>
                                                    <p className="text-xs text-slate-500">Let others join and split cost</p>
                                                </div>
                                                <button
                                                    onClick={() => setIsPublic(!isPublic)}
                                                    className={cn(
                                                        "w-12 h-6 rounded-full transition-colors relative",
                                                        isPublic ? "bg-letsplay-blue" : "bg-slate-300"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                                                        isPublic ? "left-7" : "left-1"
                                                    )} />
                                                </button>
                                            </div>

                                            {isPublic && (
                                                <div className="flex items-center justify-between pt-3 border-t">
                                                    <p className="text-sm font-bold">Max Players</p>
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => setMaxPlayers(Math.max(2, maxPlayers - 1))}
                                                            className="w-8 h-8 rounded-lg bg-white border-2 border-slate-200 font-bold"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="font-bold w-6 text-center">{maxPlayers}</span>
                                                        <button
                                                            onClick={() => setMaxPlayers(Math.min(10, maxPlayers + 1))}
                                                            className="w-8 h-8 rounded-lg bg-white border-2 border-slate-200 font-bold"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Confirm/Join Button */}
                                        <Button
                                            onClick={handleConfirmAction}
                                            disabled={getSlotStatus(selectedTime).status === 'BOOKED'}
                                            className={cn(
                                                "w-full h-12 lg:h-14 text-base lg:text-lg shadow-lg shadow-indigo-300",
                                                joinableBookingId ? "bg-green-600 hover:bg-green-700" : "bg-letsplay-blue hover:bg-indigo-700"
                                            )}
                                            size="lg"
                                        >
                                            {getSlotStatus(selectedTime).status === 'BOOKED'
                                                ? 'Slot Unavailable'
                                                : joinableBookingId
                                                    ? 'Join Game'
                                                    : 'Confirm Booking'
                                            }
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="booking-status"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center py-8"
                                    >
                                        {bookingStatus === 'PENDING' && (
                                            <>
                                                <Loader2 className="w-16 h-16 text-letsplay-blue animate-spin mx-auto mb-4" />
                                                <h3 className="text-xl font-bold text-slate-800 mb-2">Processing...</h3>
                                                <p className="text-sm text-slate-500">Confirming your booking</p>
                                            </>
                                        )}
                                        {bookingStatus === 'CONFIRMED' && (
                                            <>
                                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                                                </div>
                                                <h3 className="text-2xl font-bold text-green-700 mb-2">Booking Confirmed!</h3>
                                                <p className="text-sm text-slate-500 mb-6">Your slot has been reserved successfully</p>

                                                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 mb-6 text-left space-y-3">
                                                    <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                                                        <span className="text-sm text-slate-500">Booking ID</span>
                                                        <span className="font-mono font-bold text-slate-900">#{confirmedBookingId}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-slate-500">Venue</span>
                                                        <span className="font-medium text-slate-900">{venue.name}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-slate-500">Date</span>
                                                        <span className="font-medium text-slate-900">{selectedDate.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-slate-500">Time</span>
                                                        <span className="font-bold text-letsplay-blue">{selectedTime} ({duration}h)</span>
                                                    </div>
                                                    <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                                                        <span className="text-sm font-bold text-slate-700">Total Paid</span>
                                                        <span className="font-bold text-xl text-green-600 flex items-center"><IndianRupee className="w-4 h-4" />{totalPrice}</span>
                                                    </div>
                                                </div>

                                                <Button onClick={() => navigate('/my-bookings')} className="w-full bg-letsplay-blue hover:bg-indigo-700">
                                                    View My Bookings
                                                </Button>
                                            </>
                                        )}
                                        {bookingStatus === 'FAILED' && (
                                            <>
                                                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <XCircle className="w-10 h-10 text-red-600" />
                                                </div>
                                                <h3 className="text-2xl font-bold text-red-700 mb-2">Booking Failed</h3>
                                                <p className="text-sm text-slate-500 mb-6">{bookingError || "Please try again"}</p>
                                                <Button onClick={() => window.location.reload()} className="w-full">
                                                    Try Again
                                                </Button>
                                            </>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
