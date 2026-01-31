import { test, expect } from '@playwright/test';

test('slot blocking', async ({ page, browser }) => {
    // 1. Visit Home Page as User A
    await page.goto('/');

    // Navigate to venues
    await page.getByRole('button', { name: /browse venues/i }).first().click();

    // Wait for venues to load
    await page.waitForTimeout(2000);

    // Click the first venue's card
    await page.locator('.group').first().click();

    // 2. Select Date (Tomorrow) - Default is tomorrow in code
    // Select 10:00 slot
    await page.getByRole('button', { name: '10:00', exact: true }).click();

    // Click "Confirm Booking"
    await page.getByRole('button', { name: /confirm booking/i }).click();

    // 3. Wait for confirmation
    await expect(page.getByText('Booking Confirmed!', { exact: false })).toBeVisible({ timeout: 30000 });

    // 4. Open new Page as User B
    // 4. Open new Page as User B (New Context for isolation)
    const contextB = await browser.newContext({ baseURL: 'http://13.127.159.219' });
    const pageB = await contextB.newPage();
    await pageB.goto('/');
    await pageB.getByRole('button', { name: /browse venues/i }).first().click();
    await pageB.waitForTimeout(2000);
    await pageB.locator('.group').first().click();

    // 5. Verify 10:00 is disabled
    const timeSlot = pageB.getByRole('button', { name: '10:00', exact: true });

    // Check if it's disabled
    await expect(timeSlot).toBeDisabled();
    await expect(timeSlot).toHaveText('10:00');
});
