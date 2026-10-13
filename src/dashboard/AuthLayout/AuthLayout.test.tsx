import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import AuthLayout from './AuthLayout';

describe('AuthLayout', () => {
  it('renders a string title as the page heading', () => {
    render(<AuthLayout title="Welcome" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Welcome' })).toBeTruthy();
  });

  it('does not wrap a node title in a heading', () => {
    render(<AuthLayout title={<span>Logo lockup</span>} />);
    expect(screen.queryByRole('heading')).toBeNull();
    expect(screen.getByText('Logo lockup')).toBeTruthy();
  });

  it('orders logo, alert, form and footer', () => {
    render(
      <AuthLayout alert={<p>alert</p>} footer={<p>support</p>} logo={<i>logo</i>} title="T">
        <p>form</p>
      </AuthLayout>,
    );
    const text = document.body.textContent ?? '';
    expect(text.indexOf('logo')).toBeLessThan(text.indexOf('alert'));
    expect(text.indexOf('alert')).toBeLessThan(text.indexOf('form'));
    expect(text.indexOf('form')).toBeLessThan(text.indexOf('support'));
  });

  it('replaces children with a skeleton while loading', () => {
    render(
      <AuthLayout loading title="T">
        <p>form</p>
      </AuthLayout>,
    );
    expect(screen.queryByText('form')).toBeNull();
  });

  it('drops the card in chrome-only mode', () => {
    const { container } = render(
      <AuthLayout card={false} tools={<button type="button">tool</button>}>
        <p>status</p>
      </AuthLayout>,
    );
    expect(container.querySelector('[data-auth-card]')).toBeNull();
    expect(screen.getByText('status')).toBeTruthy();
    expect(screen.getByText('tool')).toBeTruthy();
  });

  it('renders a custom background node', () => {
    render(<AuthLayout background={<div data-testid="art" />} title="T" />);
    expect(screen.getByTestId('art')).toBeTruthy();
  });

  it('renders the aside copy', () => {
    render(<AuthLayout aside={<AuthLayout.Aside kicker="Kicker" line="Line" />} title="T" />);
    expect(screen.getByText('Kicker')).toBeTruthy();
    expect(screen.getByText('Line')).toBeTruthy();
  });
});
