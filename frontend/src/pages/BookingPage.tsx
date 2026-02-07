import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../utils/apiConfig';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Calendar, Clock, MapPin, Loader2, IndianRupee, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
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
            const offset = selectedDate.getTimezoneOffset() * 60000;
            const localDate = new Date(selectedDate.getTime() - offset);
            const dateStr = localDate.toISOString().split('T')[0];

            fetch(`${API_BASE_URL}/bookings/slots?groundId=${venue.id}&date=${dateStr}`)
                .then(res => res.json())
                .then(data => setBookedSlots(data))
                .catch(err => console.error("Failed to fetch slots", err));
        }
    }, [venue, selectedDate]);

    useEffect(() => {
        setJoinableBookingId(null);
    }, [selectedDate, venue]);

    const getSlotStatus = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const slotStart = new Date(selectedDate);
        slotStart.setHours(hours, minutes, 0, 0);
        const slotEnd = new Date(slotStart);
        slotEnd.setHours(slotStart.getHours() + duration);

        const overlappingBooking = bookedSlots.find(booking => {
            const bookingStart = new Date(booking.startTime);
            const bookingEnd = new Date(booking.endTime);
            return slotStart < bookingEnd && bookingStart < slotEnd;
        });

        if (!overlappingBooking) return { status: 'AVAILABLE' };

        if (overlappingBooking.isPublic &&
            (overlappingBooking.joinedPlayers || 1) < (overlappingBooking.maxPlayers || 1)) {
            return { status: 'JOINABLE', bookingId: overlappingBooking.id };
        }

        return { status: 'BOOKED' };
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const time = e.target.value;
        const { status, bookingId } = getSlotStatus(time);

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
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ groundId, startTime: startTime.toISOString(), endTime: endTime.toISOString(), isPublic, maxPlayers })
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
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/join`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({})
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
    const availableDates = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return date;
    });

    if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-12 h-12 text-letsplay-blue animate-spin" /></div>;
    if (!venue) return <div className="container mx-auto px-4 py-20 text-center"><h1 className="text-2xl font-bold mb-4">Venue Not Found</h1><Button onClick={() => navigate('/venues')}>Browse Venues</Button></div>;

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-8">
                <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent text-slate-500 hover:text-slate-900 transition-colors" onClick={() => navigate('/venues')}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    {/* Left: Venue Info */}
                    <div className="lg:col-span-3">
                        <div className="rounded-3xl overflow-hidden aspect-video shadow-2xl shadow-slate-200 mb-8 relative">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                            <img src={venue.imageUrl} alt={venue.name} className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 left-0 p-8 z-20 text-white">
                                <span className="px-3 py-1 bg-letsplay-blue text-white rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block">
                                    {venue.sportType}
                                </span>
                                <h1 className="text-4xl lg:text-5xl font-black mb-2 tracking-tight">{venue.name}</h1>
                                <p className="flex items-center text-white/90 font-medium text-lg">
                                    <MapPin className="w-5 h-5 mr-2" /> {venue.location}
                                </p>
                            </div>
                        </div>

                        <div className="prose prose-slate max-w-none mb-8">
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">About Venue</h3>
                            <p className="text-slate-600 leading-relaxed text-lg">{venue.description}</p>
                        </div>

                        <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-2xl font-black text-slate-900 shadow-sm border border-slate-100">
                                {venue.owner.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 text-lg">{venue.owner.name}</p>
                                <p className="text-sm font-medium text-slate-500">Venue Owner</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Booking Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-6 lg:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 lg:sticky lg:top-24">
                            <AnimatePresence mode="wait">
                                {!bookingStatus || bookingStatus === 'IDLE' ? (
                                    <motion.div key="booking-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <div className="flex justify-between items-end mb-8">
                                            <div>
                                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Total Price</p>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-4xl font-black text-slate-900 flex items-center">
                                                        <IndianRupee className="w-7 h-7" strokeWidth={3} />{totalPrice}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="block text-3xl font-black text-slate-900">{duration}h</span>
                                                <span className="text-xs font-bold text-slate-400 uppercase">Duration</span>
                                            </div>
                                        </div>

                                        {/* Date Scroller */}
                                        <div className="mb-8">
                                            <div className="flex items-center justify-between mb-4">
                                                <label className="text-sm font-bold text-slate-900">Select Date</label>
                                                <Calendar className="w-4 h-4 text-slate-400" />
                                            </div>
                                            <div className="flex gap-3 overflow-x-auto pb-4 -mx-2 px-2 snap-x hide-scrollbar">
                                                {availableDates.slice(0, 14).map((date) => {
                                                    const isSelected = date.toDateString() === selectedDate.toDateString();
                                                    return (
                                                        <button
                                                            key={date.toISOString()}
                                                            onClick={() => setSelectedDate(date)}
                                                            className={cn(
                                                                "flex-shrink-0 w-16 h-20 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 snap-start border-2",
                                                                isSelected
                                                                    ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/30 transform scale-105"
                                                                    : "bg-white text-slate-500 border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                                                            )}
                                                        >
                                                            <span className="text-xs font-bold uppercase mb-1">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                                            <span className="text-xl font-black">{date.getDate()}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-8">
                                            {/* Time Selection */}
                                            <div>
                                                <label className="block text-sm font-bold text-slate-900 mb-3">Start Time</label>
                                                <div className="relative">
                                                    <select
                                                        value={selectedTime}
                                                        onChange={handleTimeChange}
                                                        className="w-full h-12 pl-4 pr-10 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 appearance-none focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                                                    >
                                                        {TIME_SLOTS.map(time => (
                                                            <option key={time} value={time}>{time}</option>
                                                        ))}
                                                    </select>
                                                    <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                                </div>
                                            </div>

                                            {/* Duration Selection */}
                                            <div>
                                                <label className="block text-sm font-bold text-slate-900 mb-3">Duration</label>
                                                <div className="flex h-12 bg-slate-50 rounded-xl border border-slate-200 p-1">
                                                    <button onClick={() => setDuration(Math.max(1, duration - 1))} className="flex-1 rounded-lg hover:bg-white hover:shadow-sm font-bold text-slate-500 transition-all disabled:opacity-30" disabled={duration <= 1}>-</button>
                                                    <div className="flex-1 flex items-center justify-center font-bold text-slate-900">{duration}h</div>
                                                    <button onClick={() => setDuration(Math.min(4, duration + 1))} className="flex-1 rounded-lg hover:bg-white hover:shadow-sm font-bold text-slate-500 transition-all">+</button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Social Booking Toggle */}
                                        <div className="mb-8 bg-gradient-to-br from-indigo-50 to-blue-50 p-5 rounded-2xl border border-indigo-100">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <p className="font-bold text-indigo-900 text-sm mb-1">Make Match Public?</p>
                                                    <p className="text-xs text-indigo-600/80 font-medium">Split costs with new players</p>
                                                </div>
                                                <button
                                                    onClick={() => setIsPublic(!isPublic)}
                                                    className={cn("w-12 h-7 rounded-full transition-colors relative shadow-inner", isPublic ? "bg-indigo-600" : "bg-slate-200")}
                                                >
                                                    <motion.div
                                                        animate={{ x: isPublic ? 22 : 2 }}
                                                        className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm"
                                                    />
                                                </button>
                                            </div>

                                            <AnimatePresence>
                                                {isPublic && (
                                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                                        <div className="pt-4 mt-4 border-t border-indigo-200/50 flex items-center justify-between">
                                                            <span className="text-sm font-bold text-indigo-900">Total Players</span>
                                                            <div className="flex items-center gap-3 bg-white/50 rounded-lg p-1">
                                                                <button onClick={() => setMaxPlayers(Math.max(2, maxPlayers - 1))} className="w-7 h-7 rounded bg-white shadow-sm flex items-center justify-center font-bold text-indigo-600 hover:bg-indigo-50 transition-colors">-</button>
                                                                <span className="w-4 text-center font-bold text-indigo-900 text-sm">{maxPlayers}</span>
                                                                <button onClick={() => setMaxPlayers(Math.min(20, maxPlayers + 1))} className="w-7 h-7 rounded bg-white shadow-sm flex items-center justify-center font-bold text-indigo-600 hover:bg-indigo-50 transition-colors">+</button>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        <Button
                                            onClick={handleConfirmAction}
                                            disabled={getSlotStatus(selectedTime).status === 'BOOKED'}
                                            className={cn(
                                                "w-full h-14 text-lg font-black tracking-wide shadow-xl transition-transform active:scale-[0.98]",
                                                joinableBookingId ? "bg-green-600 hover:bg-green-700 shadow-green-200" : "bg-slate-900 hover:bg-slate-800 shadow-slate-300"
                                            )}
                                        >
                                            {getSlotStatus(selectedTime).status === 'BOOKED' ? 'Slot Unevailable' : joinableBookingId ? 'Join Match' : 'Pay & Book'}
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <motion.div key="booking-status" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                                        {bookingStatus === 'PENDING' && (
                                            <>
                                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                                                    <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                                                    <div className="absolute inset-0 border-4 border-slate-900 rounded-full border-t-transparent animate-spin"></div>
                                                </div>
                                                <h3 className="text-xl font-bold text-slate-900 mb-2">Processing Payment</h3>
                                                <p className="text-slate-500">Securing your slot...</p>
                                            </>
                                        )}
                                        {bookingStatus === 'CONFIRMED' && (
                                            <>
                                                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                                                </div>
                                                <h3 className="text-3xl font-black text-slate-900 mb-2">You're In!</h3>
                                                <p className="text-slate-500 font-medium mb-8">Booking confirmed successfully.</p>

                                                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8 max-w-sm mx-auto">
                                                    <div className="flex justify-between mb-2">
                                                        <span className="text-slate-500 text-sm">Booking ID</span>
                                                        <span className="font-mono font-bold text-slate-900">#{confirmedBookingId}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-500 text-sm">Total Paid</span>
                                                        <span className="font-bold text-slate-900 flex items-center"><IndianRupee size={12} />{totalPrice}</span>
                                                    </div>
                                                </div>

                                                <Button onClick={() => navigate('/my-bookings')} className="w-full bg-slate-900 text-white font-bold h-12 shadow-lg shadow-slate-200">
                                                    View Ticket
                                                </Button>
                                            </>
                                        )}
                                        {bookingStatus === 'FAILED' && (
                                            <>
                                                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                                    <XCircle className="w-10 h-10 text-red-500" />
                                                </div>
                                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Oh no!</h3>
                                                <p className="text-slate-500 mb-8">{bookingError || "Something went wrong."}</p>
                                                <Button onClick={() => window.location.reload()} variant="outline" className="w-full h-12 font-bold">
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
