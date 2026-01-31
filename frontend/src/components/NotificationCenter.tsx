import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { API_BASE_URL } from '../utils/apiConfig';
import { AnimatePresence, motion } from 'framer-motion';

interface Notification {
    id: number;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export function NotificationCenter() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        const userStr = localStorage.getItem('user');
        if (!userStr) return;
        const user = JSON.parse(userStr);

        try {
            const res = await fetch(`${API_BASE_URL}/notifications?userId=${user.id}`);
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
                // Simple logic: assume all fetched are unread for demo or filter if backend supported isRead
                // For now, backend sets isRead=false by default.
                // We'll calculate unread based on local state or simple assumption.
                // In a real app, we'd have a mark-as-read API.
                setUnreadCount(data.length);
            }
        } catch (e) {
            console.error("Failed to fetch notifications");
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
                <Bell className="w-6 h-6 text-slate-600" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden"
                        >
                            <div className="p-4 bg-slate-50 border-b border-slate-100">
                                <h3 className="font-bold text-slate-800">Notifications</h3>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-slate-500 text-sm">
                                        No new notifications
                                    </div>
                                ) : (
                                    notifications.map((n) => (
                                        <div key={n.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                            <h4 className="font-bold text-sm text-slate-800 mb-1">{n.title}</h4>
                                            <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                                            <span className="text-[10px] text-slate-400 mt-2 block">
                                                {new Date(n.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
