import { Trophy, Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function CoachDashboard() {
    return (
        <div className="space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Coach Hub</h1>
                    <p className="text-slate-500 font-medium">Manage your training sessions and tournaments.</p>
                </div>
                <Button className="h-12 px-6 bg-slate-900 font-black flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Host New Event
                </Button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Active Events</p>
                    <p className="text-3xl font-black text-slate-900">02</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Total Students</p>
                    <p className="text-3xl font-black text-slate-900">45</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Coach Rating</p>
                    <p className="text-3xl font-black text-letsplay-blue">4.9/5</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50">
                    <h2 className="font-black text-xl text-slate-900">Live Tournaments</h2>
                </div>
                <div className="p-6 text-center py-12">
                    <Trophy className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-medium">You don't have any live tournaments right now.</p>
                    <Button variant="ghost" className="mt-2">View Past Events</Button>
                </div>
            </div>
        </div>
    );
}
