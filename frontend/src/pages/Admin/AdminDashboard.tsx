import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const navigate = useNavigate();

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold">Dashboard</h2>
                <p className="text-slate-400">Welcome back, Admin.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Venues</h3>
                    <p className="text-4xl font-bold mt-2">--</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Users</h3>
                    <p className="text-4xl font-bold mt-2">--</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Active Bookings</h3>
                    <p className="text-4xl font-bold mt-2 text-emerald-400">--</p>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center min-h-[300px] flex flex-col items-center justify-center">
                <p className="text-slate-400 mb-4">Quick Actions</p>
                <button
                    onClick={() => navigate('/admin/grounds')}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                    Manage Venues
                </button>
            </div>
        </div>
    );
}
