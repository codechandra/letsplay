import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../utils/apiConfig';
import { X, Loader2 } from 'lucide-react';

interface GroundFormProps {
    onClose: () => void;
    onSuccess: () => void;
    initialData?: any;
}

export default function GroundForm({ onClose, onSuccess, initialData }: GroundFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        sportType: 'Football',
        description: '',
        pricePerHour: '',
        imageUrl: '',
        ownerId: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                location: initialData.location,
                sportType: initialData.sportType,
                description: initialData.description,
                pricePerHour: initialData.pricePerHour,
                imageUrl: initialData.imageUrl,
                ownerId: initialData.owner?.id || ''
            });
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            pricePerHour: Number(formData.pricePerHour),
            owner: { id: Number(formData.ownerId) }
        };

        const url = initialData
            ? `${API_BASE_URL}/admin/grounds/${initialData.id}`
            : `${API_BASE_URL}/admin/grounds`;

        const method = initialData ? 'PUT' : 'POST';

        // Get Credentials from somewhere (creating a mock basic auth for now as established in previous conversations or assume logged in context)
        // Ideally we should use the stored user object.
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        const authHeader = user && user.authdata ? { 'Authorization': 'Basic ' + user.authdata } : {};

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...(authHeader as Record<string, string>)
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                onSuccess();
                onClose();
            } else {
                alert('Failed to save ground');
            }
        } catch (error) {
            console.error(error);
            alert('Error saving ground');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-lg">{initialData ? 'Edit Venue' : 'Add New Venue'}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Venue Name</label>
                        <input
                            required
                            type="text"
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Sport Type</label>
                            <select
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                value={formData.sportType}
                                onChange={e => setFormData({ ...formData, sportType: e.target.value })}
                            >
                                <option>Football</option>
                                <option>Cricket</option>
                                <option>Tennis</option>
                                <option>Badminton</option>
                                <option>Basketball</option>
                                <option>Multi-Sport</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Price / Hour (₹)</label>
                            <input
                                required
                                type="number"
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                value={formData.pricePerHour}
                                onChange={e => setFormData({ ...formData, pricePerHour: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                        <input
                            required
                            type="text"
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            value={formData.location}
                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            value={formData.imageUrl}
                            onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                            placeholder="https://..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Owner ID</label>
                        <input
                            required
                            type="number"
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            value={formData.ownerId}
                            onChange={e => setFormData({ ...formData, ownerId: e.target.value })}
                            placeholder="Enter User ID of Owner"
                        />
                        {/* TODO: Replace with Dropdown fetching users */}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none h-24 resize-none"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                        >
                            {loading && <Loader2 className="animate-spin w-4 h-4" />}
                            {initialData ? 'Update Venue' : 'Create Venue'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
