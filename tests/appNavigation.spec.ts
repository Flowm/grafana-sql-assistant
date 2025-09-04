import { test, expect } from './fixtures';
import { ROUTES } from '../src/constants';

test.describe('navigating app', () => {
  test('home page should render successfully', async ({ gotoPage, page }) => {
    await gotoPage(`/${ROUTES.Home}`);
    await expect(page.getByRole('heading', { name: 'SQL Assistant' })).toBeVisible();
    await expect(
      page.getByText(
        'Conversational SQL assistant that supports in writing of SQL queries and integrates with Grafana dashboards.'
      )
    ).toBeVisible();
  });
});
