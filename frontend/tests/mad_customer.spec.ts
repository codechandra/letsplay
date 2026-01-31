import { test, expect } from '@playwright/test';

const PROD_URL = 'http://letsplay-frontend-1769695135.s3-website.ap-south-1.amazonaws.com';

test.describe('Mad Customer Scenarios', () => {

    test('Scenario 1: Unauthenticated Booking Attempt', async ({ page }) => {
        // 1. Visit Home
        await page.goto(PROD_URL);

        // 2. Click Browse Venues
        await page.click('text=Browse Venues');

        // 3. Select Ground
        await page.waitForSelector('text=Play Arena - Sarjapur');
        await page.click('text=Book Now');

        // 4. Expect Redirect to Login immediately (Protected Route)
        await expect(page).toHaveURL(/.*\/auth\/login/);
    });

    test('Scenario 2: Concurrent Booking Conflict', async ({ browser }) => {
        // Create two isolated contexts (two different users)
        const contextA = await browser.newContext();
        const contextB = await browser.newContext();

        const pageA = await contextA.newPage();
        const pageB = await contextB.newPage();

        const groundUrl = `${PROD_URL}/booking/1`;

        // 1. User A logs in
        await pageA.goto(`${PROD_URL}/auth/login`);
        await pageA.fill('input[type="email"]', 'user@letsplay.com');
        await pageA.fill('input[type="password"]', 'password');
        await pageA.click('button:has-text("Sign In")');
        // Wait for Home Page content instead of strict URL
        await expect(pageA.getByText('Book Your Game', { exact: false })).toBeVisible();
        await pageA.goto(groundUrl);

        // 2. User B logs in
        await pageB.goto(`${PROD_URL}/auth/login`);
        await pageB.fill('input[type="email"]', 'owner@letsplay.com'); // Different user
        await pageB.fill('input[type="password"]', 'password');
        await pageB.click('button:has-text("Sign In")');
        await expect(pageB.getByText('Book Your Game', { exact: false })).toBeVisible();
        await pageB.goto(groundUrl);

        // 4. Select same date
        // Assuming default date is today or tomorrow.

        // 5. User A selects 10:00 slot
        await pageA.click('button:has-text("10:00")');
        await pageA.click('text=Book Slot');

        // 6. User B sees 10:00 slot?
        // It might still be green if no realtime update.
        // User B tries to click it.
        const slotB = pageB.locator('button:has-text("10:00")');
        if (await slotB.isEnabled()) {
            await slotB.click();
            await pageB.click('text=Book Slot');

            // 7. User A Confirms Payment
            await pageA.click('text=Proceed to Checkout');
            await pageA.click('text=Confirm & Pay');
            await expect(pageA.getByText('Booking Confirmed!', { exact: false })).toBeVisible({ timeout: 60000 });

            // 8. User B tries to Confirm Payment
            // Verify User B gets error or block
            if (await pageB.url().includes('checkout')) {
                await pageB.click('text=Confirm & Pay');
                // Should fail
                // Expect error toast or failure message
                // Or Temporal workflow fails it.
            }
        }

        await contextA.close();
        await contextB.close();
    });

    test('Scenario 3: Create New Account', async ({ page }) => {
        // 1. Visit Signup
        await page.goto(`${PROD_URL}/auth/signup`);

        // 2. Fill Form with Random Email to avoid collision
        const randomEmail = `mad_customer_${Date.now()}@test.com`;
        await page.fill('input[type="text"]', 'Mad Tester');
        await page.fill('input[type="email"]', randomEmail);
        await page.fill('input[type="password"]', 'securePass123');

        // 3. Submit
        await page.click('button:has-text("Create Account")');

        // 4. Verify Redirect to Login
        await expect(page).toHaveURL(/.*\/auth\/login/);

        // 5. Verify User Name in Header (if applicable) or access protected route
        await page.click('text=Profile'); // Assuming profile button exists
    });
});
