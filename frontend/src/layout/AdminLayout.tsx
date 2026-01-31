import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, MapPin, Users, LogOut } from 'lucide-react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

export default function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/auth/login');
    };

    const navItems = [
        { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { label: 'Venues', href: '/admin/grounds', icon: MapPin },
        { label: 'Users', href: '/admin/users', icon: Users },
    ];

    return (
        <div className="flex min-h-screen bg-slate-900 text-white">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 p-6 flex flex-col">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                        letsplay<span className="text-xs text-white/50 ml-1">ADMIN</span>
                    </h1>
                </div>

                <nav className="space-y-2 flex-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={clsx(
                                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                                    isActive
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                )}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="pt-6 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 transition-colors w-full"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
