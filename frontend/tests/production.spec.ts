import { test, expect } from '@playwright/test';

test('Production: Full Booking Flow', async ({ page }) => {
    // 1. Visit Home Page
    await page.goto('/');
    await expect(page).toHaveTitle(/letsplay/i);

    // 2. Login First
    await page.goto('/auth/login');
    await page.fill('input[type="email"]', 'user@letsplay.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('/'); // Expect redirect to home

    // 3. Navigate to Explorer
    // The HomePage has a "Browse Venues" button
    await page.click('text=Browse Venues');

    // 4. Select the first ground
    await page.waitForSelector('text=Play Arena - Sarjapur');
    await page.click('text=Book Now');

    // 4. Verify in Booking Page
    // Adjust regex to match either /booking or /bookings
    await expect(page).toHaveURL(/.*\/booking.*\/\d+/);
    await expect(page.getByText('Play Arena - Sarjapur')).toBeVisible();

    // 5. Click "Proceed to Checkout"
    await page.click('text=Proceed to Checkout');

    // 6. Final Confirm in Checkout Page
    await expect(page).toHaveURL(/.*\/checkout/);
    await page.click('text=Confirm & Pay');

    // 7. Verify Status Visualization (back on booking page usually)
    await expect(page.getByText('Processing Request...')).toBeVisible();

    // 8. Wait for "Booking Confirmed"
    // We give it 60 seconds because Temporal auto-setup might take time initially
    await expect(page.getByText('Booking Confirmed!', { exact: false })).toBeVisible({ timeout: 60000 });
});
