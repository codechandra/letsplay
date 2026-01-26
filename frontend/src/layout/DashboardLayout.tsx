import { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar,
    Users,
    LogOut,
    ChevronRight,
    Trophy,
    Home
} from 'lucide-react';
import { cn } from '../utils/cn';

interface SidebarItemProps {
    to: string;
    icon: any;
    label: string;
}

function SidebarItem({ to, icon: Icon, label }: SidebarItemProps) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all",
                isActive
                    ? "bg-letsplay-blue text-white shadow-lg shadow-letsplay-blue/20"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            )}
        >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
            <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
        </NavLink>
    );
}

export default function DashboardLayout({ children, role }: { children: ReactNode, role: string }) {
    const navigate = useNavigate();

    const menuItems = {
        PLAYER: [
            { to: '/dashboard/player', icon: LayoutDashboard, label: 'Overview' },
            { to: '/dashboard/player/bookings', icon: Calendar, label: 'My Bookings' },
            { to: '/dashboard/player/teams', icon: Users, label: 'Teammates' },
        ],
        OWNER: [
            { to: '/dashboard/owner', icon: LayoutDashboard, label: 'Admin Panel' },
            { to: '/dashboard/owner/venues', icon: Home, label: 'My Venues' },
            { to: '/dashboard/owner/bookings', icon: Calendar, label: 'Bookings' },
        ],
        COACH: [
            { to: '/dashboard/coach', icon: LayoutDashboard, label: 'Coach Hub' },
            { to: '/dashboard/coach/events', icon: Trophy, label: 'My Events' },
            { to: '/dashboard/coach/students', icon: Users, label: 'Students' },
        ]
    };

    const items = menuItems[role as keyof typeof menuItems] || menuItems.PLAYER;

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-slate-200 p-6 flex flex-col sticky top-0 h-screen">
                <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="bg-letsplay-blue text-white p-2 rounded-lg font-black text-xl italic shadow-md shadow-letsplay-blue/20">L</div>
                    <span className="text-xl font-black text-slate-900 italic tracking-tighter uppercase">LETSPLAY</span>
                </div>

                <nav className="space-y-2 flex-1">
                    <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Main Menu</p>
                    {items.map((item) => (
                        <SidebarItem key={item.to} {...item} />
                    ))}
                </nav>

                <div className="pt-6 border-t border-slate-100 mt-6 md:mt-0">
                    <button
                        onClick={() => navigate('/')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 font-bold hover:text-red-500 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 p-10 overflow-auto">
                {children}
            </main>
        </div>
    );
}
