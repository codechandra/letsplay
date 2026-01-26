import { test, expect } from '@playwright/test';

test('booking flow', async ({ page }) => {
    // 1. Visit Home Page
    await page.goto('http://localhost:5173/');
    await expect(page).toHaveTitle(/letsplay/i);

    // 2. Click "Book A Court"
    await page.getByRole('button', { name: /book a court/i }).click();

    // 3. Verify Navigation to Explorer (or Booking Page if direct)
    // Our implementation currently mocks "booking/1" for demo or explores.
    // The HomePage "Book A Court" button navigates to /booking/explore which shows a placeholder in our App.tsx, 
    // wait, did I update that? 
    // App.tsx has:
    // <Route path="/booking/:id" element={<BookingPage />} />
    // But HomePage has: onClick={() => navigate('/booking/explore')}
    // So /booking/explore should render BookingPage with id="explore"?
    // Yes.

    // 4. Check Venue Name
    await expect(page.getByText('Play Arena - Sarjapur')).toBeVisible();

    // 5. Click "Confirm Booking"
    await page.getByRole('button', { name: /confirm booking/i }).click();

    // 6. Verify Status Visualization
    // Expect "Processing Request..."
    await expect(page.getByText('Processing Request...')).toBeVisible();

    // 7. Wait for "Booking Confirmed" (Temporal workflow should finish quickly)
    await expect(page.getByText('Booking Confirmed!', { exact: false })).toBeVisible({ timeout: 30000 });
});
