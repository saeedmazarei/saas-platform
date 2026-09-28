import { createMockServer } from '@saas/mocks/node';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { renderWithApp } from '@/test/renderWithApp';

const { server, db } = createMockServer();
const member = db.getUser('u-2')!;

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());

describe('profile feature', () => {
  it('lets a user update their own profile', async () => {
    renderWithApp('/profile', { user: member });

    const bio = await screen.findByLabelText('Bio');
    await userEvent.type(bio, 'I like well-structured code.');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByText('Your profile has been updated.')).toBeInTheDocument();
    expect(db.getUser('u-2')?.bio).toBe('I like well-structured code.');
  });

  it('validates the form before sending it', async () => {
    renderWithApp('/profile', { user: member });

    const name = await screen.findByLabelText('Full name');
    await userEvent.clear(name);
    await userEvent.type(name, 'A');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByText('Name must be at least 2 characters')).toBeInTheDocument();
  });
});
