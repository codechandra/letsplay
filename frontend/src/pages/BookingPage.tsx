import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../utils/apiConfig';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooking } from '../hooks/useBooking';
import { Button } from '../components/ui/Button';
import { Calendar, Clock, MapPin, CheckCircle2, XCircle, Loader2, Users, Globe, IndianRupee, ArrowLeft } from 'lucide-react';
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

export function BookingPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { createBooking, status, error, bookingId } = useBooking();

    const [venue, setVenue] = useState<Ground | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date(Date.now() + 86400000));
    const [selectedTime, setSelectedTime] = useState<string>('18:00');
    const [duration, setDuration] = useState<number>(1);
    const [isPublic, setIsPublic] = useState(false);
    const [maxPlayers, setMaxPlayers] = useState(4);

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

    const handleConfirmBooking = () => {
        if (!venue) return;

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
                    </div>

                    {/* Right: Booking Form - Takes 2 columns on desktop, sticky */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-4 lg:p-6 rounded-xl lg:rounded-2xl shadow-lg lg:sticky lg:top-24">
                            <AnimatePresence mode="wait">
                                {!status ? (
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
                                            <div className="grid grid-cols-4 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                                                {TIME_SLOTS.map((time) => {
                                                    const isSelected = time === selectedTime;
                                                    return (
                                                        <button
                                                            key={time}
                                                            onClick={() => setSelectedTime(time)}
                                                            className={cn(
                                                                "p-2.5 lg:p-3 rounded-lg border-2 font-bold transition-all text-sm",
                                                                isSelected
                                                                    ? "border-letsplay-blue bg-letsplay-blue text-white"
                                                                    : "border-slate-200 hover:border-letsplay-blue/50"
                                                            )}
                                                        >
                                                            {time}
                                                        </button>
                                                    );
                                                })}
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

                                        {/* Confirm Button */}
                                        <Button
                                            onClick={handleConfirmBooking}
                                            className="w-full h-12 lg:h-14 text-base lg:text-lg shadow-lg"
                                            size="lg"
                                        >
                                            Confirm Booking
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="booking-status"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center py-8"
                                    >
                                        {status === 'PENDING' && (
                                            <>
                                                <Loader2 className="w-16 h-16 text-letsplay-blue animate-spin mx-auto mb-4" />
                                                <h3 className="text-xl font-bold text-slate-800 mb-2">Processing...</h3>
                                                <p className="text-sm text-slate-500">Confirming your booking</p>
                                            </>
                                        )}
                                        {status === 'CONFIRMED' && (
                                            <>
                                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                                                </div>
                                                <h3 className="text-2xl font-bold text-green-700 mb-2">Booking Confirmed!</h3>
                                                <p className="text-sm text-slate-500 mb-4">Your slot has been reserved</p>
                                                <div className="bg-green-50 p-4 rounded-lg border border-green-100 mb-6">
                                                    <p className="text-xs font-bold text-green-600 uppercase">Booking ID</p>
                                                    <p className="text-2xl font-black text-green-800">#{bookingId}</p>
                                                </div>
                                                <Button onClick={() => navigate('/my-bookings')} className="w-full">
                                                    View My Bookings
                                                </Button>
                                            </>
                                        )}
                                        {status === 'FAILED' && (
                                            <>
                                                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <XCircle className="w-10 h-10 text-red-600" />
                                                </div>
                                                <h3 className="text-2xl font-bold text-red-700 mb-2">Booking Failed</h3>
                                                <p className="text-sm text-slate-500 mb-6">{error || "Please try again"}</p>
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
