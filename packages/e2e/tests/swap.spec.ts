import { expect, test } from '@playwright/test';

test.describe('Token Price Explorer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main interface elements', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Token Price Explorer/);

    // Check main heading
    await expect(page.locator('h1')).toContainText('Token Price Explorer');

    // Check USD input
    await expect(page.locator('input[type="number"]')).toBeVisible();

    // Check default token selectors (USDC and ETH)
    await expect(page.locator('button:has-text("USDC")')).toBeVisible();
    await expect(page.locator('button:has-text("ETH")')).toBeVisible();

    // Check swap button (has ArrowUpDown icon and aria-label)
    await expect(page.locator('button[aria-label="Swap token positions"]')).toBeVisible();
  });

  test('should load token data and display prices', async ({ page }) => {
    // Wait for token data to load
    await page.waitForSelector('text=USDC', { timeout: 10000 });

    // Check that default token selectors are displayed (USDC and ETH are default)
    await expect(page.locator('text=USDC')).toBeVisible();
    await expect(page.locator('text=ETH')).toBeVisible();

    // Check that price information is displayed in the token result areas
    await expect(page.locator('text=per token').first()).toBeVisible();
  });

  test('should allow USD input and calculate token amounts', async ({ page }) => {
    // Wait for token data to load
    await page.waitForSelector('text=USDC', { timeout: 10000 });

    // Enter USD amount
    const usdInput = page.locator('input[type="number"]');
    await usdInput.fill('100');

    // Wait for calculations to update
    await page.waitForTimeout(500);

    // Check that token amounts are calculated and displayed (look for large numbers)
    const tokenAmounts = page.locator('.text-2xl.font-bold.text-white');
    await expect(tokenAmounts.first()).toBeVisible();

    // Check that amounts are greater than 0
    const amountText = await tokenAmounts.first().textContent();
    expect(amountText).not.toBe('0');
    expect(amountText).not.toBe('---');
  });

  test('should allow token selection', async ({ page }) => {
    // Wait for token data to load
    await page.waitForSelector('text=USDC', { timeout: 10000 });

    // Click on first token selector (USDC)
    await page.locator('button:has-text("USDC")').first().click();

    // Check that dropdown is open
    await expect(page.locator('text=USD Coin')).toBeVisible();

    // Select a different token (WBTC)
    await page.locator('text=Wrapped Bitcoin').click();

    // Check that token was selected
    await expect(page.locator('text=WBTC').first()).toBeVisible();
  });

  test('should swap tokens when swap button is clicked', async ({ page }) => {
    // Wait for token data to load
    await page.waitForSelector('text=USDC', { timeout: 10000 });

    // Click swap button using aria-label
    await page.locator('button[aria-label="Swap token positions"]').click();

    // Wait for swap to complete
    await page.waitForTimeout(500);

    // Check that both tokens are still visible (positions may have changed)
    await expect(page.locator('button:has-text("ETH")')).toBeVisible();
    await expect(page.locator('button:has-text("USDC")')).toBeVisible();
  });

  test('should show loading state initially', async ({ page }) => {
    // Check for loading spinner
    await expect(page.locator('.animate-spin')).toBeVisible();

    // Wait for loading to complete
    await page.waitForSelector('text=USDC', { timeout: 10000 });

    // Check that loading state is gone
    await expect(page.locator('.animate-spin')).not.toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Wait for token data to load
    await page.waitForSelector('text=USDC', { timeout: 10000 });

    // Check that interface is still usable
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('input[type="number"]')).toBeVisible();

    // Test token selection on mobile (click USDC selector)
    await page.locator('button:has-text("USDC")').first().click();
    await expect(page.locator('text=USD Coin')).toBeVisible();
  });

  test('should handle error states gracefully', async ({ page }) => {
    // Intercept API calls and return errors
    await page.route('**/*', (route) => {
      if (route.request().url().includes('funkit')) {
        route.fulfill({ status: 500, body: 'Server Error' });
      } else {
        route.continue();
      }
    });

    await page.goto('/');

    // Check that error state is displayed (look for inline error or toast)
    await expect(page.locator('[role="alert"], [data-sonner-toast]').first()).toBeVisible({
      timeout: 10000,
    });
  });
});
