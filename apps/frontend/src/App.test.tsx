import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches and displays the store name in the app bar', async () => {
    global.fetch = vi.fn((url) => {
      if (url.toString().includes('/store-name')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ name: 'The Tech Library' }),
        });
      }
      if (url.toString().includes('/products')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    }) as any;

    render(<App />);

    // Wait for store name to appear
    expect(await screen.findByText('The Tech Library')).toBeInTheDocument();

    // Ensure correct fetch call
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/store-name',
      expect.any(Object)
    );
  });

  it('renders placeholder text when store name is empty', async () => {
    global.fetch = vi.fn((url) => {
      if (url.toString().includes('/store-name')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ name: '' }),
        });
      }
      if (url.toString().includes('/products')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    }) as any;

    render(<App />);

    // The placeholder is the fallback title in the AppBar
    expect(
      await screen.findByText('Product Catalog')
    ).toBeInTheDocument();
  });

  it('renders the correct number of product cards', async () => {
    global.fetch = vi.fn((url) => {
      if (url.toString().includes('/store-name')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ name: 'Test Store' }),
        });
      }
      if (url.toString().includes('/products')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              { id: 1, name: 'Book A', type: 'Books', price: 10 },
              { id: 2, name: 'Camera', type: 'Electronics', price: 199 },
              { id: 3, name: 'T-Shirt', type: 'Clothing', price: 15 },
            ]),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    }) as any;

    render(<App />);

    // Wait for products to appear
    expect(await screen.findByText('Book A')).toBeInTheDocument();
    expect(screen.getByText('Camera')).toBeInTheDocument();
    expect(screen.getByText('T-Shirt')).toBeInTheDocument();

    // Count rendered cards
    const cards = screen.getAllByRole('button', { name: /Add to Wishlist/i });
    expect(cards.length).toBe(3);
  });


  it('filters products by type', async () => {
    global.fetch = vi.fn((url) => {
      if (url.toString().includes('/store-name')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ name: 'Test Store' }),
        });
      }
      if (url.toString().includes('/products')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              { id: 1, name: 'Book A', type: 'Books', price: 10 },
              { id: 2, name: 'Camera', type: 'Electronics', price: 199 },
              { id: 3, name: 'T-Shirt', type: 'Clothing', price: 15 },
            ]),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    }) as any;

    render(<App />);

    // Wait for initial load
    await screen.findByText('Book A');

    const select = screen.getByLabelText('Type');
    const user = userEvent.setup();

    // Filter to Electronics
    await user.click(select);
    await user.click(screen.getByRole('option', { name: 'Electronics' }));

    expect(screen.getByText('Camera')).toBeInTheDocument();
    expect(screen.queryByText('Book A')).not.toBeInTheDocument();
    expect(screen.queryByText('T-Shirt')).not.toBeInTheDocument();

    // Reset to All
    await user.click(select);
    await user.click(screen.getByRole('option', { name: 'All' }));

    expect(screen.getByText('Book A')).toBeInTheDocument();
    expect(screen.getByText('Camera')).toBeInTheDocument();
    expect(screen.getByText('T-Shirt')).toBeInTheDocument();
  });
});
