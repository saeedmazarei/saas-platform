import { createMockServer } from '@saas/mocks/node';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { renderWithApp } from '@/test/renderWithApp';

const { server, db } = createMockServer();
const admin = db.getUser('u-1')!;

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());

describe('users feature', () => {
  it('lists users and filters them by search term', async () => {
    const { router } = renderWithApp('/users', { user: admin });

    const table = await screen.findByRole('table', { name: 'Users' });
    expect(within(table).getAllByRole('row')).toHaveLength(11); // header + 10 rows

    await userEvent.type(screen.getByLabelText('Search users'), 'user@example');

    await waitFor(() => expect(router.state.location.search).toBe('?search=user%40example'));
    expect(await screen.findByRole('link', { name: 'Uma User' })).toBeInTheDocument();
    await waitFor(() => expect(within(table).getAllByRole('row')).toHaveLength(2));
  });

  it('edits a user and shows the new data on the details page', async () => {
    const { router } = renderWithApp('/users/u-2/edit', { user: admin });

    const name = await screen.findByLabelText('Full name');
    await userEvent.clear(name);
    await userEvent.type(name, 'Uma Updated');
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(await screen.findByRole('heading', { name: 'Uma Updated' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/users/u-2');
    expect(db.getUser('u-2')?.name).toBe('Uma Updated');
  });

  it('shows the API conflict error next to the email field', async () => {
    renderWithApp('/users/u-2/edit', { user: admin });

    const email = await screen.findByLabelText('Email');
    await userEvent.clear(email);
    await userEvent.type(email, 'admin@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(await screen.findByText('This email is already in use.')).toBeInTheDocument();
  });

  it('shows a not-found state for an unknown user', async () => {
    renderWithApp('/users/nope', { user: admin });

    expect(await screen.findByText('User not found')).toBeInTheDocument();
  });
});
