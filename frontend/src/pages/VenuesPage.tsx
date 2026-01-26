import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../utils/apiConfig';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapPin, Search, Filter, Users, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

interface Ground {
    id: number;
    name: String;
    location: String;
    sportType: String;
    pricePerHour: number;
    imageUrl: String;
}

export default function VenuesPage() {
    const [grounds, setGrounds] = useState<Ground[]>([]);
    const [publicBookings, setPublicBookings] = useState<any[]>([]);
    const [viewMode, setViewMode] = useState<'venues' | 'social'>('venues');
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const categoryQuery = searchParams.get('category');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (viewMode === 'venues') {
                    const url = categoryQuery
                        ? `http://localhost:8082/api/grounds?sportType=${categoryQuery}`
                        : 'http://localhost:8082/api/grounds';
                    const res = await fetch(url);
                    setGrounds(await res.json());
                } else {
                    const res = await fetch(`${API_BASE_URL}/bookings/public`);
                    setPublicBookings(await res.json());
                }
            } catch (err) {
                console.error('Failed to fetch data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [categoryQuery, viewMode]);

    const handleJoin = async (bookingId: number) => {
        try {
            const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/join?userId=1`, {
                method: 'POST'
            });
            if (res.ok) {
                // Refresh data
                const updatedRes = await fetch('http://localhost:8082/api/bookings/public');
                setPublicBookings(await updatedRes.json());
                alert("Joined the game! See you on the field.");
            }
        } catch (err) {
            console.error('Failed to join', err);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                        {viewMode === 'venues' ? 'Explore Venues' : 'Join a Game'}
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">
                        {viewMode === 'venues' ? 'Find the perfect spot for your next game' : 'Connect with other players and split the cost'}
                    </p>
                </div>

                <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl">
                    <button
                        onClick={() => setViewMode('venues')}
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-sm font-black transition-all",
                            viewMode === 'venues' ? "bg-white text-letsplay-blue shadow-lg shadow-slate-200" : "text-slate-500 hover:text-slate-900"
                        )}
                    >
                        Book Venue
                    </button>
                    <button
                        onClick={() => setViewMode('social')}
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-sm font-black transition-all",
                            viewMode === 'social' ? "bg-white text-letsplay-blue shadow-lg shadow-slate-200" : "text-slate-500 hover:text-slate-900"
                        )}
                    >
                        Find Games
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
                <div className="flex items-center gap-3 flex-1">
                    <div className="relative flex-1 max-w-lg">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search venues..."
                            className="pl-10 pr-4 h-11 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-letsplay-blue/10 focus:border-letsplay-blue w-full md:w-64"
                        />
                    </div>
                    <Button variant="outline" className="h-11 border-slate-200">
                        <Filter className="w-4 h-4 mr-2" /> Filter
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-letsplay-blue"></div>
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    {viewMode === 'venues' ? (
                        <motion.div
                            key="venues-grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {grounds.map((ground, index) => (
                                <motion.div
                                    key={ground.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 group cursor-pointer"
                                    onClick={() => navigate(`/booking/${ground.id}`)}
                                >
                                    <div className="aspect-[4/3] overflow-hidden relative">
                                        <img
                                            src={ground.imageUrl as string}
                                            alt={ground.name as string}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-letsplay-blue shadow-sm">
                                            {ground.sportType}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-letsplay-blue transition-colors">{ground.name}</h3>
                                        <p className="flex items-center text-slate-500 text-sm mb-4">
                                            <MapPin className="w-4 h-4 mr-1" /> {ground.location}
                                        </p>
                                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                            <div className="text-letsplay-blue font-bold text-lg">
                                                ₹{ground.pricePerHour}<span className="text-slate-400 text-sm font-normal"> / hour</span>
                                            </div>
                                            <Button size="sm" className="rounded-lg">Book Now</Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="social-feed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-6 max-w-4xl mx-auto"
                        >
                            {publicBookings.length === 0 ? (
                                <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                                    <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                    <p className="text-slate-500 font-bold">No public games found yet.</p>
                                    <Button variant="ghost" className="mt-2" onClick={() => setViewMode('venues')}>Be the first to host!</Button>
                                </div>
                            ) : (
                                publicBookings.map((booking, index) => (
                                    <motion.div
                                        key={booking.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-6"
                                    >
                                        <div className="h-24 w-24 rounded-2xl overflow-hidden flex-shrink-0">
                                            <img src={booking.ground.imageUrl} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="flex-1 text-center md:text-left">
                                            <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
                                                <span className="px-2 py-0.5 bg-letsplay-blue/10 text-letsplay-blue text-[10px] font-black uppercase rounded-md tracking-wider">
                                                    {booking.ground.sportType}
                                                </span>
                                                <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" /> Tomorrow, 6:00 PM
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900">{booking.ground.name}</h3>
                                            <p className="text-sm text-slate-500 font-medium">Hosted by <span className="text-slate-900">{booking.user.name}</span></p>
                                        </div>
                                        <div className="flex items-center gap-6 pr-4">
                                            <div className="text-center">
                                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Players</p>
                                                <div className="flex items-center gap-1 font-black text-slate-900">
                                                    <Users className="w-4 h-4 text-letsplay-blue" />
                                                    {booking.joinedPlayers}/{booking.maxPlayers}
                                                </div>
                                            </div>
                                            <Button
                                                className="h-12 px-8 rounded-2xl bg-slate-900 hover:bg-black group"
                                                onClick={() => handleJoin(booking.id)}
                                            >
                                                Join <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            )
            }

            {!loading && grounds.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-slate-500 text-lg">No venues found for this category.</p>
                    <Button variant="ghost" className="mt-4" onClick={() => navigate('/venues')}>View All Venues</Button>
                </div>
            )}
        </div>
    );
}
