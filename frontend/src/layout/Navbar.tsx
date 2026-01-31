import { Search, User, Heart, ShoppingCart, MessageSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { NotificationCenter } from '../components/NotificationCenter';

export function Navbar() {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.reload();
    };

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-8">
                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="flex items-center gap-2">
                        <div className="bg-gradient-primary text-white p-2.5 rounded-xl font-black text-2xl italic shadow-lg shadow-primary-500/30">
                            L
                        </div>
                        <span className="text-2xl font-black bg-gradient-primary bg-clip-text text-transparent italic tracking-tighter uppercase">
                            LETSPLAY
                        </span>
                    </div>
                </Link>

                {/* Navigation Links - Desktop */}
                <nav className="hidden lg:flex items-center gap-8">
                    <Link to="/play" className="text-sm font-bold text-slate-700 hover:text-green-600 transition-colors flex items-center gap-1">
                        Play
                    </Link>
                    <Link to="/venues" className="text-sm font-bold text-slate-700 hover:text-primary-600 transition-colors">
                        Book
                    </Link>
                    <Link to="/my-bookings" className="text-sm font-bold text-slate-700 hover:text-primary-600 transition-colors">
                        My Bookings
                    </Link>
                </nav>

                {/* Search Bar */}
                <div className="flex-1 max-w-2xl hidden md:block">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Search for cricket, football, badminton..."
                            onClick={() => navigate('/venues')}
                            className="w-full bg-slate-50 border-2 border-transparent rounded-xl py-3 pl-12 pr-4 text-sm font-medium focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all placeholder:text-slate-400 text-slate-900"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                    </div>
                </div>

                {/* Action Icons */}
                <div className="flex items-center gap-6 text-slate-700">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <NotificationCenter />
                            <Link to="/chat" className="p-2 text-slate-500 hover:text-letsplay-blue transition-colors relative">
                                <MessageSquare className="w-6 h-6" />
                            </Link>
                            <div className="hidden lg:flex flex-col items-end">
                                <span className="text-sm font-bold text-slate-900">{user.name}</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => navigate('/dashboard')}
                                        className="text-xs text-primary-600 hover:underline font-bold"
                                    >
                                        Dashboard
                                    </button>
                                    <span className="text-xs text-slate-300">|</span>
                                    <button
                                        onClick={handleLogout}
                                        className="text-xs text-slate-500 hover:text-red-500 font-bold"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                            <div className="h-11 w-11 rounded-full bg-gradient-primary flex items-center justify-center text-white font-black shadow-lg shadow-primary-500/30">
                                {user.name[0]}
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => navigate('/auth/login')}
                            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-primary text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all"
                        >
                            <User className="h-4 w-4" />
                            <span className="hidden lg:inline">Sign In</span>
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
