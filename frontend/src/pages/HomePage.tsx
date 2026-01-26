import { Button } from '../components/ui/Button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

const CATEGORIES = [
    { name: 'Football', icon: '⚽', color: 'bg-blue-50', count: 12 },
    { name: 'Cricket', icon: '🏏', color: 'bg-orange-50', count: 8 },
    { name: 'Badminton', icon: '🏸', color: 'bg-green-50', count: 15 },
    { name: 'Tennis', icon: '🎾', color: 'bg-yellow-50', count: 5 },
];

export function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="pb-20">
            {/* Hero Section */}
            <section className="relative h-[600px] bg-slate-900 flex items-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=2400"
                        alt="Hero Background"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-2xl text-center md:text-left">
                        <span className="inline-block py-1 px-3 rounded bg-letsplay-yellow text-slate-900 text-xs font-black uppercase tracking-widest mb-6">
                            New Season 2026
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter mb-6 leading-[0.9]">
                            UNLEASH YOUR <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-letsplay-blue to-teal-400 font-sans italic-none">POTENTIAL</span>
                        </h1>
                        <p className="text-lg text-slate-300 mb-8 font-medium max-w-lg leading-relaxed">
                            Discover world-class sports facilities, join local events, and connect with a community of athletes. Your journey starts here.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                            <Button size="lg" onClick={() => navigate('/venues')}>
                                Book A Court <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-slate-900 transition-all">
                                Find Events
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Functional Categories */}
            <section className="container mx-auto px-4 -mt-16 relative z-20">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {CATEGORIES.map((cat) => (
                        <motion.div
                            key={cat.name}
                            whileHover={{ y: -8 }}
                            className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100 cursor-pointer group"
                            onClick={() => navigate(`/venues?category=${cat.name}`)}
                        >
                            <div className={cn("h-16 w-16 rounded-2xl mb-6 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-inner", cat.color)}>
                                {cat.icon}
                            </div>
                            <h3 className="font-black text-xl mb-1 text-slate-900">{cat.name}</h3>
                            <p className="text-sm text-slate-500 font-medium">Explore {cat.count}+ venues</p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}
