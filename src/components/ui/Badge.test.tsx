// @vitest-environment jsdom
/* ═══════════════════════════════════════════════════════
   Tests — Badge Component
   ═══════════════════════════════════════════════════════ */

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders children correctly', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeTruthy();
  });

  it('applies variant classes correctly', () => {
    const { container } = render(<Badge variant="critical">Critical Badge</Badge>);
    expect(container.firstChild).toBeTruthy();
    expect(container.innerHTML).toContain('Critical Badge');
  });

  it('renders with default neutral variant', () => {
    const { container } = render(<Badge>Neutral</Badge>);
    expect(container.innerHTML).toContain('Neutral');
  });

  it('renders with live variant', () => {
    const { container } = render(<Badge variant="live">Live</Badge>);
    expect(container.innerHTML).toContain('Live');
  });

  it('renders with warning variant', () => {
    const { container } = render(<Badge variant="warning">Warning</Badge>);
    expect(container.innerHTML).toContain('Warning');
  });

  it('renders with info variant', () => {
    const { container } = render(<Badge variant="info">Info</Badge>);
    expect(container.innerHTML).toContain('Info');
  });

  it('renders with success variant', () => {
    const { container } = render(<Badge variant="success">Success</Badge>);
    expect(container.innerHTML).toContain('Success');
  });

  it('renders pulse dot when pulse prop is true', () => {
    const { container } = render(<Badge pulse variant="live">Live</Badge>);
    const dot = container.querySelector('.status-dot');
    expect(dot).toBeTruthy();
  });

  it('does not render pulse dot when pulse is false', () => {
    const { container } = render(<Badge pulse={false}>No Pulse</Badge>);
    const dot = container.querySelector('.status-dot');
    expect(dot).toBeNull();
  });

  it('renders icon when provided', () => {
    render(<Badge icon={<span data-testid="badge-icon">🏟️</span>}>Stadium</Badge>);
    expect(screen.getByTestId('badge-icon')).toBeTruthy();
  });

  it('applies custom className', () => {
    const { container } = render(<Badge className="custom-badge">Custom</Badge>);
    expect(container.querySelector('.custom-badge')).toBeTruthy();
  });
});
