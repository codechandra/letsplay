import { Calendar, Users, Clock, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function PlayerDashboard() {
    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-black text-slate-900">Welcome back, Chandra!</h1>
                <p className="text-slate-500 font-medium">Here's what's happening with your sports life.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Upcoming Games</p>
                    <p className="text-3xl font-black text-slate-900">03</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Teammates Met</p>
                    <p className="text-3xl font-black text-slate-900">12</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Social Rank</p>
                    <p className="text-3xl font-black text-letsplay-blue">#04</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                    <h2 className="font-black text-xl text-slate-900">Recent Bookings</h2>
                    <Button variant="ghost" size="sm">View All <ArrowRight className="w-4 h-4 ml-2" /></Button>
                </div>
                <div className="divide-y divide-slate-50">
                    {[1, 2].map((i) => (
                        <div key={i} className="p-6 flex items-center gap-6">
                            <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl">⚽</div>
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-900">Turf Park - Koramangala</h4>
                                <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                                    <Calendar className="w-3 h-3" /> Tomorrow, 6:00 PM
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase rounded-full tracking-wider">
                                    Confirmed
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
