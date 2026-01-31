import { useState } from 'react';
import { X, Loader2, Star } from 'lucide-react';
import { Button } from '../ui/Button';
import { StarRating } from '../ui/StarRating';
import { API_BASE_URL } from '../../utils/apiConfig';
import { motion, AnimatePresence } from 'framer-motion';

interface RatingModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookingId: number;
    players: { id: number; name: string }[];
    currentUser: { id: number };
}

export function RatingModal({ isOpen, onClose, bookingId, players, currentUser }: RatingModalProps) {
    const [ratings, setRatings] = useState<Record<number, number>>({});
    const [comments, setComments] = useState<Record<number, string>>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Filter out current user from players to rate
    const playersToRate = players.filter(p => p.id !== currentUser.id);

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const promises = playersToRate.map(player => {
                const score = ratings[player.id];
                if (!score) return Promise.resolve(); // Skip unrated

                return fetch(`${API_BASE_URL}/ratings`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        bookingId,
                        revieweeId: player.id,
                        score,
                        comment: comments[player.id] || ''
                    })
                });
            });

            await Promise.all(promises);
            setSubmitted(true);
            setTimeout(() => {
                onClose();
                setSubmitted(false);
                setRatings({});
                setComments({});
            }, 2000);
        } catch (error) {
            console.error("Failed to submit ratings", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
                >
                    <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                        <h3 className="font-bold text-lg">Rate Players</h3>
                        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full">
                            <X className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>

                    <div className="p-6 max-h-[60vh] overflow-y-auto">
                        {submitted ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Star className="w-8 h-8 text-green-600 fill-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-green-700">Thank You!</h3>
                                <p className="text-slate-500">Your feedback helps improve the community.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <p className="text-slate-600 text-sm">
                                    How was your experience playing with these folks? Your ratings are anonymous.
                                </p>

                                {playersToRate.length === 0 && (
                                    <p className="text-center text-slate-500 italic py-4">No other players to rate in this booking.</p>
                                )}

                                {playersToRate.map(player => (
                                    <div key={player.id} className="bg-slate-50 p-4 rounded-xl space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-slate-900">{player.name}</p>
                                                <p className="text-xs text-slate-500">Player</p>
                                            </div>
                                            <StarRating
                                                rating={ratings[player.id] || 0}
                                                onRatingChange={(r) => setRatings(prev => ({ ...prev, [player.id]: r }))}
                                                size="md"
                                            />
                                        </div>
                                        <textarea
                                            placeholder={`Optional comment about ${player.name}...`}
                                            className="w-full text-sm p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-letsplay-blue/20 resize-none h-20"
                                            value={comments[player.id] || ''}
                                            onChange={(e) => setComments(prev => ({ ...prev, [player.id]: e.target.value }))}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {!submitted && playersToRate.length > 0 && (
                        <div className="p-4 border-t bg-slate-50 flex justify-end gap-3">
                            <Button variant="ghost" onClick={onClose}>Skip</Button>
                            <Button onClick={handleSubmit} disabled={submitting || Object.keys(ratings).length === 0}>
                                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Submit Ratings
                            </Button>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
