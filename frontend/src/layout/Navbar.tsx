import { Menu, Search, ShoppingCart, User, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export function Navbar() {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.reload();
    };

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-slate-200/80 backdrop-blur-md bg-white/90">
            {/* Top Bar */}
            <div className="bg-slate-50 border-b border-slate-100 hidden lg:block">
                <div className="container mx-auto px-4 h-9 flex items-center justify-end gap-6 text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                    <a href="#" className="hover:text-letsplay-blue transition-colors">Find a Store</a>
                    <a href="#" className="hover:text-letsplay-blue transition-colors">Contact Us</a>
                    <a href="#" className="hover:text-letsplay-blue transition-colors">Help</a>
                </div>
            </div>

            <div className="container mx-auto px-4 h-[72px] flex items-center justify-between gap-8">
                {/* Logo Section */}
                <div className="flex items-center gap-6">
                    <button className="flex flex-col items-center gap-1 group text-slate-700 hover:text-letsplay-blue transition-colors">
                        <Menu className="h-6 w-6" />
                        <span className="text-[10px] font-bold uppercase hidden md:block">Menu</span>
                    </button>

                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="flex items-center gap-2">
                            <div className="bg-letsplay-blue text-white p-2 rounded-lg font-black text-2xl italic shadow-md shadow-letsplay-blue/20">L</div>
                            <span className="text-2xl font-black text-slate-900 italic tracking-tighter uppercase">LETSPLAY</span>
                        </div>
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="flex-1 max-w-2xl hidden md:block">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="What are you looking for?"
                            className="w-full bg-slate-100 border border-transparent rounded-lg py-3 pl-12 pr-4 text-sm font-medium focus:bg-white focus:border-letsplay-blue focus:ring-4 focus:ring-letsplay-blue/10 outline-none transition-all placeholder:text-slate-400 text-slate-900"
                        />
                        <Search className="absolute left-4 top-3 h-5 w-5 text-slate-400 group-focus-within:text-letsplay-blue transition-colors" />
                    </div>
                </div>

                {/* Action Icons */}
                <div className="flex items-center gap-6 text-slate-700">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-end">
                                <span className="text-xs font-bold text-slate-900">{user.name}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => navigate('/dashboard')} className="text-[10px] text-letsplay-blue hover:underline font-black uppercase tracking-wider">Dashboard</button>
                                    <span className="text-[10px] text-slate-300">|</span>
                                    <button onClick={handleLogout} className="text-[10px] text-slate-400 hover:text-red-500 font-bold uppercase">Logout</button>
                                </div>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-letsplay-blue flex items-center justify-center text-white font-black">
                                {user.name[0]}
                            </div>
                        </div>
                    ) : (
                        <button onClick={() => navigate('/auth/login')} className="flex flex-col items-center gap-1 hover:text-letsplay-blue transition-colors">
                            <User className="h-5 w-5" />
                            <span className="text-[10px] font-bold uppercase hidden lg:block">Sign In</span>
                        </button>
                    )}
                    <button className="flex flex-col items-center gap-1 hover:text-letsplay-blue transition-colors">
                        <Heart className="h-5 w-5" />
                        <span className="text-[10px] font-bold uppercase hidden lg:block">Wishlist</span>
                    </button>
                    <div className="relative group cursor-pointer">
                        <button className="flex flex-col items-center gap-1 group-hover:text-letsplay-blue transition-colors">
                            <ShoppingCart className="h-5 w-5" />
                            <span className="text-[10px] font-bold uppercase hidden lg:block">Cart</span>
                        </button>
                        <div className="absolute -top-1 -right-1 bg-letsplay-yellow text-slate-900 text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">0</div>
                    </div>
                </div>
            </div>
        </header>
    );
}
