import { render, screen, waitFor } from '@testing-library/react';
import { AppInitializer } from './AppInitializer';
import { vi } from 'vitest';

describe('AppInitializer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock the global fetch function
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ id: '123' }),
      })
    ) as unknown as typeof fetch;
  });

  it('shows the loader when the user ID is not in local storage', async () => {
    render(
      <AppInitializer>
        <div data-testid="children">Children</div>
      </AppInitializer>
    );

    expect(screen.getByTestId('app-initializer-loader')).toBeInTheDocument();
  });

  it('shows the children after the request and user ID is now in storage', async () => {
    render(
      <AppInitializer>
        <div data-testid="children">Children</div>
      </AppInitializer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('children')).toBeInTheDocument();
    });
  });

  it('does not make the network call and shows children if the page is loaded with local storage', async () => {
    render(
      <AppInitializer>
        <div data-testid="children">Children</div>
      </AppInitializer>
    );

    expect(screen.getByTestId('children')).toBeInTheDocument();
  });
});
