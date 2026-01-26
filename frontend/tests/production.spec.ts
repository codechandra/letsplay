import { test, expect } from '@playwright/test';

const PROD_URL = 'http://13.234.116.216';

test('Production: Full Booking Flow', async ({ page }) => {
    // 1. Visit Home Page
    await page.goto(PROD_URL);
    await expect(page).toHaveTitle(/letsplay/i);

    // 2. Navigate to Explorer
    // The HomePage has a "Book A Court" button or category links
    await page.click('text=Book Venue');

    // 3. Select the first ground
    await page.waitForSelector('text=Play Arena - Sarjapur');
    await page.click('text=Book Now');

    // 4. Verify in Booking Page
    await expect(page).toHaveURL(/.*\/booking\/\d+/);
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
