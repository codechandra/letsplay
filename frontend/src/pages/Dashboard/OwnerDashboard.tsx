import { DollarSign, Home, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function OwnerDashboard() {
    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-black text-slate-900">Admin Dashboard</h1>
                <p className="text-slate-500 font-medium">Manage your venues and track revenue.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-letsplay-blue p-6 rounded-3xl shadow-xl shadow-letsplay-blue/20 text-white">
                    <p className="text-blue-200 text-xs font-black uppercase tracking-widest mb-2">Total Revenue</p>
                    <p className="text-3xl font-black italic flex items-center gap-1"><DollarSign /> 42,500</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Active Venues</p>
                    <p className="text-3xl font-black text-slate-900 italic">04</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Bookings Today</p>
                    <p className="text-3xl font-black text-slate-900 italic">18</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Occupancy</p>
                    <p className="text-3xl font-black text-letsplay-yellow flex items-center gap-2 italic">
                        <TrendingUp className="w-6 h-6" /> 82%
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                        <h2 className="font-black text-xl text-slate-900">Next Bookings</h2>
                        <Button variant="ghost" size="sm">Manage Slots</Button>
                    </div>
                    <div className="p-6 space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">{i}</div>
                                <div className="flex-1">
                                    <p className="font-bold text-slate-900">Play Arena - Slot A</p>
                                    <p className="text-xs text-slate-400 font-medium italic">5:00 PM - 6:00 PM</p>
                                </div>
                                <span className="bg-blue-50 text-letsplay-blue px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Paid</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black mb-4 italic">Expand your reach</h3>
                        <p className="text-slate-400 mb-6 font-medium">List a new sports facility and start earning in minutes.</p>
                        <Button className="bg-letsplay-yellow text-slate-900 font-black hover:bg-yellow-400">Add New Venue</Button>
                    </div>
                    <div className="absolute top-0 right-0 p-8 opacity-20">
                        <Home className="w-40 h-40" />
                    </div>
                </div>
            </div>
        </div>
    );
}
