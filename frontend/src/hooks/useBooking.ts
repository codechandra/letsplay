import { useState, useCallback, useRef } from 'react';

// Types (based on backend)
export interface Booking {
    id?: number;
    user: { id: number };
    ground: { id: number };
    startTime: string; // ISO String
    endTime: string;   // ISO String
    status?: 'PENDING' | 'CONFIRMED' | 'FAILED' | 'CANCELLED';
    temporalWorkflowId?: string;
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
            const res = await fetch(`http://localhost:8082/api/bookings/${id}`);
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

    const createBooking = async (venueId: number, startTime: Date, endTime: Date, isPublic: boolean = false, maxPlayers: number = 1) => {
        setIsLoading(true);
        setError(null);
        setStatus('PENDING');

        try {
            const response = await fetch('http://localhost:8082/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: { id: 1 }, // Hardcoded user for now
                    ground: { id: venueId },
                    startTime: startTime.toISOString(),
                    endTime: endTime.toISOString(),
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

    return {
        createBooking,
        status,
        bookingId,
        isLoading,
        error
    };
}
