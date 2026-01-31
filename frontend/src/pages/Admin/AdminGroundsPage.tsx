import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '../../utils/apiConfig';
import GroundForm from './GroundForm';

export default function AdminGroundsPage() {
    const [grounds, setGrounds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingGround, setEditingGround] = useState<any>(null);

    const fetchGrounds = async () => {
        setLoading(true);
        try {
            // Using the public endpoint for list is fine, or use admin endpoint if implemented
            const res = await fetch(`${API_BASE_URL}/grounds`);
            const data = await res.json();
            setGrounds(data);
        } catch (error) {
            console.error("Failed to fetch grounds", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGrounds();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this venue?')) return;

        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        const authHeader = user && user.authdata ? { 'Authorization': 'Basic ' + user.authdata } : {};

        try {
            const res = await fetch(`${API_BASE_URL}/admin/grounds/${id}`, {
                method: 'DELETE',
                headers: authHeader as Record<string, string>
            });
            if (res.ok) fetchGrounds();
            else alert('Failed to delete');
        } catch (error) {
            console.error(error);
            alert('Error deleting');
        }
    };

    const filteredGrounds = grounds.filter(g =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Manage Venues</h2>
                <button
                    onClick={() => { setEditingGround(null); setShowForm(true); }}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium"
                >
                    <Plus size={20} />
                    Add Venue
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search venues..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
            </div>

            {/* List */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-slate-400 uppercase text-xs font-semibold">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Venue Name</th>
                            <th className="px-6 py-4">Sport</th>
                            <th className="px-6 py-4">Location</th>
                            <th className="px-6 py-4">Price/Hr</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400">Loading...</td></tr>
                        ) : filteredGrounds.map(ground => (
                            <tr key={ground.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 text-slate-500">#{ground.id}</td>
                                <td className="px-6 py-4 font-medium">{ground.name}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">
                                        {ground.sportType}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-400">{ground.location}</td>
                                <td className="px-6 py-4 font-bold text-emerald-400">₹{ground.pricePerHour}</td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button
                                        onClick={() => { setEditingGround(ground); setShowForm(true); }}
                                        className="p-2 hover:bg-blue-500/20 text-blue-400 rounded transition-colors"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(ground.id)}
                                        className="p-2 hover:bg-red-500/20 text-red-400 rounded transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && filteredGrounds.length === 0 && (
                    <div className="px-6 py-12 text-center text-slate-500">
                        No venues found matching your search.
                    </div>
                )}
            </div>

            {showForm && (
                <GroundForm
                    initialData={editingGround}
                    onClose={() => setShowForm(false)}
                    onSuccess={() => { fetchGrounds(); }}
                />
            )}
        </div>
    );
}
