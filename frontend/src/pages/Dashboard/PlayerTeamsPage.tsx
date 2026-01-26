import { Users, UserPlus, Trophy, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function PlayerTeamsPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">Teammates</h1>
                <p className="text-slate-500">Connect with players you've met on the field</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Total Teammates</p>
                    <p className="text-3xl font-black text-slate-900">12</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Games Together</p>
                    <p className="text-3xl font-black text-slate-900">28</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Win Rate</p>
                    <p className="text-3xl font-black text-letsplay-blue">67%</p>
                </div>
            </div>

            {/* Teammates List */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-black text-xl text-slate-900">Recent Teammates</h2>
                    <Button size="sm">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Find Players
                    </Button>
                </div>

                <div className="divide-y divide-slate-100">
                    {[
                        { name: 'Rahul Sharma', sport: 'Football', games: 8, avatar: '⚽' },
                        { name: 'Priya Patel', sport: 'Badminton', games: 5, avatar: '🏸' },
                        { name: 'Arjun Kumar', sport: 'Cricket', games: 12, avatar: '🏏' },
                        { name: 'Sneha Reddy', sport: 'Tennis', games: 3, avatar: '🎾' },
                    ].map((teammate, i) => (
                        <div key={i} className="p-6 flex items-center gap-6 hover:bg-slate-50 transition-colors">
                            <div className="h-16 w-16 bg-gradient-to-br from-letsplay-blue to-blue-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                                {teammate.avatar}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-900 text-lg">{teammate.name}</h4>
                                <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                                    <Trophy className="w-3 h-3" /> {teammate.sport} Player
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-black text-letsplay-blue">{teammate.games}</p>
                                <p className="text-xs text-slate-400 font-bold uppercase">Games</p>
                            </div>
                            <Button variant="outline" size="sm">
                                View Profile
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Upcoming Games */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="font-black text-xl text-slate-900">Upcoming Team Games</h2>
                </div>

                <div className="p-6">
                    <div className="text-center py-12">
                        <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900 mb-2">No upcoming team games</h3>
                        <p className="text-slate-500 mb-6">Join a public booking to play with others</p>
                        <Button onClick={() => window.location.href = '/venues'}>
                            Find Public Games
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
