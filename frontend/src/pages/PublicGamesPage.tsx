import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../utils/apiConfig';
import { MapPin, User } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { cn } from '../utils/cn';

interface PublicBooking {
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
    maxPlayers: number;
    joinedPlayers: number;
    ownerName: string; // Assuming backend sends this flattened or nested
}

export default function PublicGamesPage() {
    const [games, setGames] = useState<PublicBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [filterSport, setFilterSport] = useState<string>('All');

    useEffect(() => {
        fetch(`${API_BASE_URL}/bookings/public`)
            .then(res => res.json())
            .then(data => {
                setGames(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const filteredGames = filterSport === 'All'
        ? games
        : games.filter(g => g.ground.sportType === filterSport);

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="container mx-auto px-4">

                {/* Header & Filters */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 mb-2">Games in Bangalore</h1>
                        <p className="text-slate-500">Join upcoming games and meet new players</p>
                    </div>

                    <div className="flex items-center gap-3 overflow-x-auto pb-2">
                        {['All', 'Badminton', 'Football', 'Cricket', 'Tennis'].map(sport => (
                            <button
                                key={sport}
                                onClick={() => setFilterSport(sport)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all",
                                    filterSport === sport
                                        ? "bg-green-500 text-white shadow-lg shadow-green-200"
                                        : "bg-white text-slate-600 border border-slate-200 hover:border-green-500"
                                )}
                            >
                                {sport === 'All' ? 'All Sports' : sport}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Games Grid */}
                {loading ? (
                    <div className="text-center py-20">Loading games...</div>
                ) : filteredGames.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No games found</h3>
                        <p className="text-slate-500 mb-6">Be the first to create a public game!</p>
                        <Button onClick={() => navigate('/venues')}>Create Game</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredGames.map(game => {
                            const startDate = new Date(game.startTime);
                            const endDate = new Date(game.endTime);
                            const spotsLeft = game.maxPlayers - game.joinedPlayers;

                            return (
                                <div key={game.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                                    {/* Sport Tag */}
                                    <div className="absolute top-0 right-0 bg-green-500/10 text-green-700 text-xs font-bold px-3 py-1.5 rounded-bl-xl">
                                        {game.ground.sportType}
                                    </div>

                                    {/* Header */}
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden border-2 border-white shadow-sm">
                                            {/* Ideally user avatar, using placeholder */}
                                            <div className="w-full h-full flex items-center justify-center bg-letsplay-blue text-white font-bold text-lg">
                                                {game.ground.name[0]}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="font-bold text-slate-900">1 Going</span>
                                            </div>
                                            <p className="text-xs text-slate-500">Hosted by Player #{game.id}</p>
                                        </div>
                                    </div>

                                    {/* Date & Time */}
                                    <div className="mb-4">
                                        <p className="font-bold text-slate-900 text-sm mb-1.5">
                                            {startDate.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}, {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                        <div className="flex items-center text-xs text-slate-500">
                                            <MapPin className="w-3.5 h-3.5 mr-1" />
                                            {game.ground.name} (~1.2 km)
                                        </div>
                                    </div>

                                    {/* Stats & Action */}
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-orange-50 text-orange-600 px-2 py-1 rounded-md text-xs font-bold flex items-center">
                                                <User className="w-3 h-3 mr-1" />
                                                {spotsLeft} Spots Left
                                            </div>
                                            <div className="text-xs font-bold text-slate-400">
                                                Intermediate
                                            </div>
                                        </div>

                                        <Button
                                            size="sm"
                                            className="bg-green-500 hover:bg-green-600 text-white font-bold"
                                            onClick={() => navigate(`/booking/${game.ground.id}`)}
                                        >
                                            Booked
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
