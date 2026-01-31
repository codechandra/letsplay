import { useState, useCallback, useRef } from 'react';
import { API_BASE_URL } from '../utils/apiConfig';

// Types (based on backend)
export interface Booking {
    id?: number;
    user: { id: number };
    ground: { id: number };
    startTime: string; // ISO String
    endTime: string;   // ISO String
    status?: 'PENDING' | 'CONFIRMED' | 'FAILED' | 'CANCELLED';
    temporalWorkflowId?: string;
    isPublic?: boolean;
    maxPlayers?: number;
    joinedPlayers?: number;
}

export function useBooking() {
    const [status, setStatus] = useState<Booking['status'] | null>(null);
    const [bookingId, setBookingId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // To stop polling when component unmounts
    const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

    const pollStatus = useCallback(async (id: number) => {
        try {
            const res = await fetch(`${API_BASE_URL}/bookings/${id}`);
            if (!res.ok) throw new Error('Failed to fetch booking status');

            const data: Booking = await res.json();
            setStatus(data.status);

            if (data.status === 'PENDING') {
                // Continue polling
                pollTimerRef.current = setTimeout(() => pollStatus(id), 2000);
            } else {
                setIsLoading(false);
            }
        } catch (e) {
            console.error(e);
            // Don't stop polling immediately on network hiccup, but maybe limit retries in prod
            // For now, we just stop to avoid infinite loops in dev
            setIsLoading(false);
            setError('Failed to track booking status');
        }
    }, []);

    // Helper to get current user ID
    const getUserId = () => {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        try {
            const user = JSON.parse(userStr);
            return user.id;
        } catch (e) {
            return null;
        }
    };

    // Helper to format Date as Local ISO string (YYYY-MM-DDTHH:mm:ss)
    const toLocalISOString = (date: Date) => {
        const offset = date.getTimezoneOffset() * 60000; // offset in milliseconds
        const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0, -1);
        return localISOTime;
    };

    const createBooking = async (venueId: number, startTime: Date, endTime: Date, isPublic: boolean = false, maxPlayers: number = 1) => {
        setIsLoading(true);
        setError(null);
        setStatus('PENDING');

        const userId = getUserId();
        if (!userId) {
            setError('Please login to book');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: { id: userId },
                    ground: { id: venueId },
                    startTime: toLocalISOString(startTime),
                    endTime: toLocalISOString(endTime),
                    isPublic,
                    maxPlayers
                })
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            const booking: Booking = await response.json();
            setBookingId(booking.id!);

            // Start Polling
            pollStatus(booking.id!);

        } catch (e: any) {
            console.error(e);
            setError(e.message || 'Booking Request Failed');
            setIsLoading(false);
            setStatus('FAILED');
        }
    };

    const joinBooking = async (existingBookingId: number) => {
        setIsLoading(true);
        setError(null);
        setStatus('PENDING');

        const userId = getUserId();
        if (!userId) {
            setError('Please login to join');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/bookings/${existingBookingId}/join?userId=${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            // Response is now a JoinRequest, not Booking
            // const request = await response.json(); 
            // We just set status to CONFIRMED (as in request sent)
            setStatus('CONFIRMED');

            // For UI feedback, we might want to distinguish between "Booking Confirmed" and "Request Sent"
            // But for now, CONFIRMED "Request Sent" works.

        } catch (e: any) {
            console.error(e);
            setError(e.message || 'Join Request Failed');
            setIsLoading(false);
            setStatus('FAILED');
        }
    };

    const respondToRequest = async (requestId: number, action: 'ACCEPTED' | 'REJECTED') => {
        try {
            const res = await fetch(`${API_BASE_URL}/requests/${requestId}/respond?status=${action}`, {
                method: 'POST'
            });
            if (!res.ok) throw new Error('Failed to respond');
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    };

    return {
        createBooking,
        joinBooking,
        respondToRequest,
        status,
        bookingId,
        isLoading,
        error
    };
}
