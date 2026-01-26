import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useBooking } from '../hooks/useBooking';
import { Button } from '../components/ui/Button';
import { Calendar, Clock, MapPin, CheckCircle2, XCircle, Loader2, Users, Globe } from 'lucide-react';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data (In a real app, fetch this based on ID)
const MOCK_VENUE = {
    id: 1,
    name: "Play Arena - Sarjapur",
    location: "Sarjapur Road, Bangalore",
    description: "Premium football turf with FIFA certified grass. Floodlights available for night games. Changing rooms and parking available.",
    price: 1200,
    image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=1200"
};

export function BookingPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { createBooking, status, error, bookingId } = useBooking();
    const [venue, setVenue] = useState(MOCK_VENUE);
    const [selectedDate] = useState(new Date(Date.now() + 86400000));
    const [isPublic, setIsPublic] = useState(false);
    const [maxPlayers, setMaxPlayers] = useState(4);

    const location = useLocation();
    const confirmFlow = location.state?.confirmed;

    useEffect(() => {
        if (id && !isNaN(Number(id))) {
            fetch(`http://localhost:8082/api/grounds/${id}`)
                .then(res => res.json())
                .then(data => setVenue(data))
                .catch(err => console.error(err));
        }
    }, [id]);

    useEffect(() => {
        if (confirmFlow) {
            handleFinalConfirm();
        }
    }, [confirmFlow]);

    const handleProceedToCheckout = () => {
        const startTime = new Date(selectedDate);
        startTime.setHours(18, 0, 0, 0);
        const endTime = new Date(startTime);
        endTime.setHours(19, 0, 0, 0);

        const bookingData = {
            venueId: venue.id,
            startTime,
            endTime,
            isPublic,
            maxPlayers
        };

        navigate('/checkout', { state: { bookingData, venue } });
    };

    const handleFinalConfirm = () => {
        const { bookingData } = location.state || {};
        if (bookingData) {
            createBooking(
                bookingData.venueId,
                new Date(bookingData.startTime),
                new Date(bookingData.endTime),
                bookingData.isPublic,
                bookingData.maxPlayers
            );
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent" onClick={() => navigate('/')}>
                &larr; Back to Venues
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Venue Info */}
                <div>
                    <div className="rounded-2xl overflow-hidden aspect-video mb-8 shadow-lg">
                        <img src={MOCK_VENUE.image} alt={MOCK_VENUE.name} className="w-full h-full object-cover" />
                    </div>

                    <h1 className="text-3xl font-bold text-slate-900 mb-2">{MOCK_VENUE.name}</h1>
                    <p className="flex items-center text-slate-500 mb-6 font-medium">
                        <MapPin className="w-5 h-5 mr-2 text-letsplay-blue" /> {MOCK_VENUE.location}
                    </p>

                    <div className="prose prose-slate">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">About this venue</h3>
                        <p className="text-slate-600 leading-relaxed">{MOCK_VENUE.description}</p>
                    </div>
                </div>

                {/* Right: Booking Action & Status */}
                <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 h-fit sticky top-24">
                    <h2 className="text-xl font-bold mb-6 flex items-center justify-between">
                        Book a Slot
                        <span className="text-letsplay-blue text-2xl">₹{MOCK_VENUE.price}</span>
                    </h2>

                    <div className="space-y-4 mb-8">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-white p-2.5 rounded-lg shadow-sm text-letsplay-blue"><Calendar className="w-5 h-5" /></div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date</p>
                                    <p className="font-bold text-slate-900">{selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-white p-2.5 rounded-lg shadow-sm text-letsplay-blue"><Clock className="w-5 h-5" /></div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Time</p>
                                    <p className="font-bold text-slate-900">18:00 - 19:00</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social Booking Options */}
                    {!status && !confirmFlow && (
                        <div className="mb-8 p-6 bg-letsplay-blue/5 rounded-3xl border border-letsplay-blue/10">
                            <h3 className="text-sm font-black text-letsplay-blue uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Globe className="w-4 h-4" /> Social Play
                            </h3>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="font-bold text-slate-900">Make Booking Public</p>
                                    <p className="text-xs text-slate-500">Allow others to join and split the cost</p>
                                </div>
                                <button
                                    onClick={() => setIsPublic(!isPublic)}
                                    className={cn(
                                        "w-12 h-6 rounded-full transition-colors relative",
                                        isPublic ? "bg-letsplay-blue" : "bg-slate-200"
                                    )}
                                >
                                    <div className={cn(
                                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                                        isPublic ? "left-7" : "left-1"
                                    )} />
                                </button>
                            </div>

                            <AnimatePresence>
                                {isPublic && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pt-2 flex items-center justify-between">
                                            <p className="text-sm font-bold text-slate-700">Max Players</p>
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => setMaxPlayers(Math.max(2, maxPlayers - 1))} className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold">-</button>
                                                <span className="font-black text-slate-900 w-4 text-center">{maxPlayers}</span>
                                                <button onClick={() => setMaxPlayers(Math.min(10, maxPlayers + 1))} className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold">+</button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Workflow Status Visualization */}
                    <AnimatePresence mode="wait">
                        {!status && !confirmFlow && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <Button onClick={handleProceedToCheckout} className="w-full h-14 text-lg shadow-lg shadow-letsplay-blue/20" size="lg">
                                    Proceed to Checkout
                                </Button>
                            </motion.div>
                        )}

                        {status && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div className="relative pt-2">
                                    {/* Progress Bar Background */}
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            className={cn("h-full transition-all duration-1000",
                                                status === 'CONFIRMED' ? "bg-green-500" :
                                                    status === 'FAILED' ? "bg-red-500" :
                                                        "bg-letsplay-blue animate-pulse"
                                            )}
                                            initial={{ width: "0%" }}
                                            animate={{ width: status === 'CONFIRMED' ? "100%" : "60%" }}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
                                    {status === 'PENDING' && (
                                        <>
                                            <Loader2 className="w-12 h-12 text-letsplay-blue animate-spin" />
                                            <h3 className="text-lg font-bold text-slate-800">Processing Request...</h3>
                                            <p className="text-sm text-slate-500">Checking availability with venue...</p>
                                        </>
                                    )}
                                    {status === 'CONFIRMED' && (
                                        <>
                                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                                                <CheckCircle2 className="w-8 h-8" />
                                            </div>
                                            <h3 className="text-xl font-bold text-green-700">Booking Confirmed!</h3>
                                            <p className="text-sm text-slate-500">Your slot has been reserved successfully.</p>
                                            <div className="mt-4 bg-green-50 p-3 rounded-lg border border-green-100">
                                                <p className="text-xs font-bold text-green-600 uppercase tracking-widest">Booking Number</p>
                                                <p className="text-lg font-black text-green-800">#BK-{bookingId || '...'} </p>
                                            </div>
                                        </>
                                    )}
                                    {status === 'FAILED' && (
                                        <>
                                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-2">
                                                <XCircle className="w-8 h-8" />
                                            </div>
                                            <h3 className="text-xl font-bold text-red-700">Booking Failed</h3>
                                            <p className="text-sm text-slate-500">{error || "Something went wrong. Please try again."}</p>
                                            <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="mt-4">Try Again</Button>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
