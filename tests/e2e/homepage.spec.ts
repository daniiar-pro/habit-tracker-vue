import { test, expect } from '@playwright/test'

test.describe('Initialize App  E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.clear())

    //  Replace with your own localhost: (3000, 8080 etc)
    await page.goto('http://localhost:5173')
  })

  test('Display modal  when user name is not in localStorage', async ({ page }) => {
    await expect(page.locator('.modal-overlay')).toBeVisible()

    await expect(page.locator('.modal h3')).toHaveText('Please Enter Your Name')
  })

  test('User submits name and sees the welcome message', async ({ page }) => {
    await page.fill('input[placeholder="Your name"]', 'Daniiar')

    await page.click('button:has-text("Submit")')

    await expect(page.locator('.modal-overlay')).not.toBeVisible()

    await expect(page.locator('.welcome-message')).toHaveText('Welcome, Daniiar!')
  })

  test('Display error message appears when input is empty', async ({ page }) => {
    await page.click('button:has-text("Submit")')

    await expect(page.locator('.error-message')).toHaveText('Name cannot be empty')

    await expect(page.locator('input[placeholder="Your name"]')).toHaveClass(/input-invalid/)
  })

  test('Modal does will not display if user name is stored in localStorage', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('userName', 'Daniiar')
    })

    await page.reload()

    await expect(page.locator('.modal-overlay')).not.toBeVisible()

    await expect(page.locator('.welcome-message')).toHaveText('Welcome, Daniiar!')
  })
})
