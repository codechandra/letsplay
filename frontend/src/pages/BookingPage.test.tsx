import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BookingPage } from './BookingPage';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Mock useBooking hook
const mockCreateBooking = vi.fn();
// const mockStatus = null; 

vi.mock('../hooks/useBooking', () => ({
    useBooking: () => ({
        createBooking: mockCreateBooking,
        status: null,
        error: null,
        isLoading: false
    })
}));

describe('BookingPage', () => {
    it('renders venue details', () => {
        render(
            <BrowserRouter>
                <BookingPage />
            </BrowserRouter>
        );
        expect(screen.getByText('Play Arena - Sarjapur')).toBeInTheDocument();
        expect(screen.getByText('₹1200')).toBeInTheDocument();
    });

    it('initiates booking on click', async () => {
        render(
            <BrowserRouter>
                <BookingPage />
            </BrowserRouter>
        );

        const bookButton = screen.getByRole('button', { name: /confirm booking/i });
        fireEvent.click(bookButton);

        await waitFor(() => {
            expect(mockCreateBooking).toHaveBeenCalled();
        });
    });
});
