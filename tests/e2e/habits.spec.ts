import { test, expect } from '@playwright/test'

test.describe('Habits Component E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.clear())

    //  Replace with your own localhost: (3000, 8080 etc)
    await page.goto('http://localhost:5173')
  })

  test('User can add a new habit', async ({ page }) => {
    await page.click('button:has-text("Add new habit")')

    await page.fill('input[placeholder="Enter habit title"]', 'Morning Exercise')

    await page.click('button:has-text("Add Habit")')

    await expect(page.locator('.habit-item h3:has-text("Morning Exercise")')).toBeVisible()
  })

  test('User can delete a habit', async ({ page }) => {
    await page.click('button:has-text("Add new habit")')
    await page.fill('input[placeholder="Enter habit title"]', 'Removable Habit')
    await page.click('button:has-text("Add Habit")')

    await page.locator('.habit-item:has-text("Removable Habit") .delete-btn').click()

    await expect(page.locator('.habit-item:has-text("Removable Habit")')).not.toBeVisible()
  })
})
