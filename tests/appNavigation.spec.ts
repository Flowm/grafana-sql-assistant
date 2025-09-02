import { test, expect } from './fixtures';
import { ROUTES } from '../src/constants';

test.describe('navigating app', () => {
  test('home page should render successfully', async ({ gotoPage, page }) => {
    await gotoPage(`/${ROUTES.Home}`);
    await expect(page.getByText('SQL LLM Copilot')).toBeVisible();
    await expect(
      page.getByText('Your AI assistant for SQL queries, data analysis, and observability insights.')
    ).toBeVisible();
  });
});
