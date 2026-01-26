import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../utils/apiConfig';
import { Button } from '../components/ui/Button';
import {
    Search, MapPin, Star, TrendingUp, Users, Calendar,
    ArrowRight, Sparkles, Trophy, Clock, CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Ground {
    id: number;
    name: string;
    location: string;
    sportType: string;
    pricePerHour: number;
    imageUrl: string;
}

const SPORT_CATEGORIES = [
    { name: 'Football', icon: '⚽', color: 'from-green-400 to-emerald-600', count: 8 },
    { name: 'Cricket', icon: '🏏', color: 'from-blue-400 to-indigo-600', count: 6 },
    { name: 'Badminton', icon: '🏸', color: 'from-purple-400 to-pink-600', count: 4 },
    { name: 'Tennis', icon: '🎾', color: 'from-yellow-400 to-orange-600', count: 3 },
    { name: 'Basketball', icon: '🏀', color: 'from-orange-400 to-red-600', count: 2 },
];

const FEATURES = [
    { icon: Calendar, title: 'Easy Booking', desc: 'Book your slot in seconds' },
    { icon: Users, title: 'Find Players', desc: 'Connect with teammates' },
    { icon: Trophy, title: 'Track Stats', desc: 'Monitor your progress' },
    { icon: CheckCircle, title: 'Instant Confirm', desc: 'Real-time confirmation' },
];

const TESTIMONIALS = [
    {
        name: 'Rahul Sharma',
        role: 'Football Enthusiast',
        image: '⚽',
        quote: 'Best platform to book sports venues! Found amazing turfs near me.',
        rating: 5,
    },
    {
        name: 'Priya Patel',
        role: 'Badminton Player',
        image: '🏸',
        quote: 'Love the social booking feature. Met so many great players!',
        rating: 5,
    },
    {
        name: 'Arjun Kumar',
        role: 'Cricket Fan',
        image: '🏏',
        quote: 'Professional venues at affordable prices. Highly recommended!',
        rating: 5,
    },
];

export function HomePage() {
    const navigate = useNavigate();
    const [featuredVenues, setFeaturedVenues] = useState<Ground[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetch(`${API_BASE_URL}/grounds`)
            .then(res => res.json())
            .then(data => setFeaturedVenues(data.slice(0, 6)))
            .catch(console.error);
    }, []);

    const handleSearch = () => {
        navigate(`/venues?search=${searchQuery}`);
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-purple-600 to-pink-500 text-white">
                {/* Animated Background */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
                    <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl animate-float delay-200"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl animate-float delay-400"></div>
                </div>

                <div className="relative container mx-auto px-4 py-20 lg:py-32">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center lg:text-left"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6 animate-fade-in">
                                <Sparkles className="w-4 h-4" />
                                <span className="text-sm font-semibold">India's #1 Sports Booking Platform</span>
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight animate-fade-in-up">
                                Book Your Game,
                                <span className="block bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                                    Play Your Best
                                </span>
                            </h1>

                            <p className="text-xl lg:text-2xl text-white/90 mb-8 font-medium animate-fade-in-up delay-100">
                                Discover premium sports venues across India. Book instantly, play together, win more.
                            </p>

                            {/* Search Bar */}
                            <div className="flex flex-col sm:flex-row gap-3 mb-8 animate-fade-in-up delay-200">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search for cricket, football, badminton..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl text-slate-900 text-lg font-medium focus:outline-none focus:ring-4 focus:ring-white/30 shadow-2xl"
                                    />
                                </div>
                                <Button
                                    onClick={handleSearch}
                                    size="lg"
                                    className="bg-white text-primary-600 hover:bg-white/90 shadow-2xl px-8 font-bold"
                                >
                                    Search <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-6 animate-fade-in-up delay-300">
                                <div>
                                    <div className="text-3xl lg:text-4xl font-black mb-1">20+</div>
                                    <div className="text-white/80 text-sm font-medium">Premium Venues</div>
                                </div>
                                <div>
                                    <div className="text-3xl lg:text-4xl font-black mb-1">500+</div>
                                    <div className="text-white/80 text-sm font-medium">Happy Players</div>
                                </div>
                                <div>
                                    <div className="text-3xl lg:text-4xl font-black mb-1">1000+</div>
                                    <div className="text-white/80 text-sm font-medium">Games Played</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Image/Illustration */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="hidden lg:block"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl backdrop-blur-sm"></div>
                                <img
                                    src="https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800"
                                    alt="Sports"
                                    className="rounded-3xl shadow-2xl hover-lift"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Wave Divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F8FAFC" />
                    </svg>
                </div>
            </section>

            {/* Sport Categories */}
            <section className="py-16 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">
                            Browse by <span className="gradient-text">Sport</span>
                        </h2>
                        <p className="text-xl text-slate-600">Find the perfect venue for your favorite game</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
                        {SPORT_CATEGORIES.map((sport, idx) => (
                            <motion.div
                                key={sport.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                onClick={() => navigate(`/venues?category=${sport.name}`)}
                                className="group cursor-pointer"
                            >
                                <div className={`bg-gradient-to-br ${sport.color} p-8 rounded-3xl shadow-lg hover-lift hover-glow text-center`}>
                                    <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">{sport.icon}</div>
                                    <h3 className="text-white font-bold text-lg mb-1">{sport.name}</h3>
                                    <p className="text-white/80 text-sm">{sport.count} venues</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Venues */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-2">
                                Featured <span className="gradient-text">Venues</span>
                            </h2>
                            <p className="text-xl text-slate-600">Top-rated sports facilities near you</p>
                        </div>
                        <Button onClick={() => navigate('/venues')} variant="outline" className="hidden md:flex">
                            View All <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {featuredVenues.map((venue, idx) => (
                            <motion.div
                                key={venue.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                onClick={() => navigate(`/booking/${venue.id}`)}
                                className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-lg hover-lift"
                            >
                                <div className="relative aspect-video overflow-hidden">
                                    <img
                                        src={venue.imageUrl}
                                        alt={venue.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-sm font-bold text-primary-600 shadow-lg">
                                            {venue.sportType}
                                        </span>
                                    </div>
                                    <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-sm font-bold">4.8</span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="font-bold text-xl text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
                                        {venue.name}
                                    </h3>
                                    <p className="text-slate-600 flex items-center mb-4">
                                        <MapPin className="w-4 h-4 mr-2 text-primary-500" />
                                        {venue.location}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t">
                                        <div>
                                            <p className="text-xs text-slate-400 mb-1">Starting from</p>
                                            <p className="text-2xl font-black text-primary-600">
                                                ₹{venue.pricePerHour}
                                                <span className="text-sm text-slate-400 font-normal">/hr</span>
                                            </p>
                                        </div>
                                        <Button size="sm" className="bg-gradient-primary text-white">
                                            Book Now
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-12 md:hidden">
                        <Button onClick={() => navigate('/venues')} size="lg">
                            View All Venues <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">
                            Why Choose <span className="gradient-text">LetsPlay</span>
                        </h2>
                        <p className="text-xl text-slate-600">Everything you need for the perfect game</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {FEATURES.map((feature, idx) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center"
                            >
                                <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
                                    <feature.icon className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                                <p className="text-slate-600">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">
                            What Players <span className="gradient-text">Say</span>
                        </h2>
                        <p className="text-xl text-slate-600">Join thousands of happy sports enthusiasts</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {TESTIMONIALS.map((testimonial, idx) => (
                            <motion.div
                                key={testimonial.name}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-3xl shadow-lg hover-lift"
                            >
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-slate-700 mb-6 text-lg leading-relaxed">"{testimonial.quote}"</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-2xl">
                                        {testimonial.image}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{testimonial.name}</p>
                                        <p className="text-sm text-slate-500">{testimonial.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-primary-500 via-purple-600 to-pink-500 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl animate-float delay-300"></div>
                </div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl lg:text-6xl font-black mb-6">
                            Ready to Play?
                        </h2>
                        <p className="text-xl lg:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
                            Join India's largest sports community. Book your first game today!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                onClick={() => navigate('/venues')}
                                size="lg"
                                className="bg-white text-primary-600 hover:bg-white/90 shadow-2xl px-8 text-lg font-bold"
                            >
                                Browse Venues <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                            <Button
                                onClick={() => navigate('/auth/signup')}
                                size="lg"
                                variant="outline"
                                className="border-2 border-white text-white hover:bg-white/10 px-8 text-lg font-bold"
                            >
                                Sign Up Free
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
