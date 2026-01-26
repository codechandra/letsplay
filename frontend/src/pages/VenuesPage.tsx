import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../utils/apiConfig';
import { Button } from '../components/ui/Button';
import { MapPin, Search, Filter, IndianRupee, Star, Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';

interface Ground {
    id: number;
    name: string;
    location: string;
    sportType: string;
    description: string;
    pricePerHour: number;
    imageUrl: string;
}

const SPORT_TYPES = ['All', 'Football', 'Cricket', 'Badminton', 'Tennis', 'Basketball', 'Multi-Sport'];
const PRICE_RANGES = [
    { label: 'All Prices', min: 0, max: Infinity },
    { label: 'Under ₹1000', min: 0, max: 1000 },
    { label: '₹1000 - ₹2000', min: 1000, max: 2000 },
    { label: 'Above ₹2000', min: 2000, max: Infinity }
];

export default function VenuesPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const categoryQuery = searchParams.get('category');

    const [grounds, setGrounds] = useState<Ground[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSport, setSelectedSport] = useState(categoryQuery || 'All');
    const [selectedPriceRange, setSelectedPriceRange] = useState(0);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const url = categoryQuery
            ? `${API_BASE_URL}/grounds?sportType=${categoryQuery}`
            : `${API_BASE_URL}/grounds`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                setGrounds(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [categoryQuery]);

    // Filter grounds
    const filteredGrounds = grounds.filter(ground => {
        const matchesSearch = ground.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ground.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSport = selectedSport === 'All' || ground.sportType === selectedSport;
        const priceRange = PRICE_RANGES[selectedPriceRange];
        const matchesPrice = ground.pricePerHour >= priceRange.min && ground.pricePerHour <= priceRange.max;

        return matchesSearch && matchesSport && matchesPrice;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-12 h-12 text-letsplay-blue animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section - Responsive */}
            <div className="bg-gradient-to-br from-letsplay-blue to-blue-700 text-white">
                <div className="container mx-auto px-4 py-8 lg:py-16">
                    <h1 className="text-3xl lg:text-5xl font-black mb-3 lg:mb-4">
                        Find Your Perfect Venue
                    </h1>
                    <p className="text-blue-100 text-base lg:text-xl mb-6 lg:mb-8">
                        Book premium sports facilities across India
                    </p>

                    {/* Search Bar - Responsive */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by venue name or location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 lg:py-4 rounded-xl text-slate-900 text-base lg:text-lg focus:outline-none focus:ring-2 focus:ring-white/50"
                            />
                        </div>
                        <Button
                            onClick={() => setShowFilters(!showFilters)}
                            className="sm:w-auto bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/30"
                        >
                            <Filter className="w-5 h-5 mr-2" />
                            Filters
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 lg:py-8">
                {/* Filters Section - Collapsible on mobile */}
                {showFilters && (
                    <div className="bg-white rounded-xl p-4 lg:p-6 mb-6 shadow-sm">
                        {/* Sport Type Filter */}
                        <div className="mb-6">
                            <h3 className="font-bold text-slate-900 mb-3 text-sm lg:text-base">Sport Type</h3>
                            <div className="flex flex-wrap gap-2">
                                {SPORT_TYPES.map(sport => (
                                    <button
                                        key={sport}
                                        onClick={() => setSelectedSport(sport)}
                                        className={cn(
                                            "px-3 lg:px-4 py-2 rounded-lg font-semibold text-sm lg:text-base transition-all",
                                            selectedSport === sport
                                                ? "bg-letsplay-blue text-white"
                                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                        )}
                                    >
                                        {sport}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range Filter */}
                        <div>
                            <h3 className="font-bold text-slate-900 mb-3 text-sm lg:text-base">Price Range</h3>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                                {PRICE_RANGES.map((range, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedPriceRange(idx)}
                                        className={cn(
                                            "px-3 lg:px-4 py-2 rounded-lg font-semibold text-sm lg:text-base transition-all",
                                            selectedPriceRange === idx
                                                ? "bg-letsplay-blue text-white"
                                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                        )}
                                    >
                                        {range.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Results Count */}
                <div className="flex items-center justify-between mb-4 lg:mb-6">
                    <p className="text-slate-600 text-sm lg:text-base">
                        <span className="font-bold text-slate-900">{filteredGrounds.length}</span> venues found
                    </p>
                    {(searchTerm || selectedSport !== 'All' || selectedPriceRange !== 0) && (
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedSport('All');
                                setSelectedPriceRange(0);
                            }}
                            className="text-sm text-letsplay-blue font-semibold hover:underline"
                        >
                            Clear filters
                        </button>
                    )}
                </div>

                {/* Venues Grid - Responsive */}
                {filteredGrounds.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 lg:p-20 text-center">
                        <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-2">
                            No venues found
                        </h3>
                        <p className="text-slate-500 mb-6">
                            Try adjusting your filters or search terms
                        </p>
                        <Button onClick={() => {
                            setSearchTerm('');
                            setSelectedSport('All');
                            setSelectedPriceRange(0);
                        }}>
                            Clear All Filters
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                        {filteredGrounds.map((ground) => (
                            <div
                                key={ground.id}
                                className="bg-white rounded-xl lg:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group"
                                onClick={() => navigate(`/booking/${ground.id}`)}
                            >
                                {/* Image */}
                                <div className="aspect-video overflow-hidden relative">
                                    <img
                                        src={ground.imageUrl}
                                        alt={ground.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute top-3 left-3">
                                        <span className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-lg text-xs lg:text-sm font-bold text-letsplay-blue">
                                            {ground.sportType}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4 lg:p-5">
                                    <h3 className="font-bold text-slate-900 mb-2 text-base lg:text-lg line-clamp-1 group-hover:text-letsplay-blue transition-colors">
                                        {ground.name}
                                    </h3>

                                    <p className="text-sm text-slate-500 mb-3 flex items-start">
                                        <MapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                                        <span className="line-clamp-1">{ground.location}</span>
                                    </p>

                                    <p className="text-xs lg:text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                                        {ground.description}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t">
                                        <div>
                                            <p className="text-xs text-slate-400 mb-0.5">Starting from</p>
                                            <div className="flex items-center text-xl lg:text-2xl font-bold text-letsplay-blue">
                                                <IndianRupee className="w-4 h-4 lg:w-5 lg:h-5" />
                                                {ground.pricePerHour}
                                                <span className="text-xs lg:text-sm text-slate-400 font-normal ml-1">/hr</span>
                                            </div>
                                        </div>
                                        <Button size="sm" className="group-hover:bg-letsplay-blue group-hover:text-white">
                                            Book Now
                                        </Button>
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
