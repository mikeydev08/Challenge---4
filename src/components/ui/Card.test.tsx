// @vitest-environment jsdom
/* ═══════════════════════════════════════════════════════
   Tests — Card Components
   ═══════════════════════════════════════════════════════ */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Card, CardHeader, CardTitle } from './Card';

describe('Card', () => {
  it('renders children correctly', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeTruthy();
  });

  it('renders CardHeader and CardTitle together', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>My Title</CardTitle>
        </CardHeader>
        <div>Content Body</div>
      </Card>,
    );
    expect(screen.getByText('My Title')).toBeTruthy();
    expect(screen.getByText('Content Body')).toBeTruthy();
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="my-card">Test</Card>);
    expect(container.querySelector('.my-card')).toBeTruthy();
  });

  it('has button role when onClick is provided', () => {
    const handleClick = vi.fn();
    render(<Card onClick={handleClick}>Clickable</Card>);
    const card = screen.getByRole('button');
    expect(card).toBeTruthy();
  });

  it('does not have button role without onClick', () => {
    render(<Card>Non-clickable</Card>);
    const btn = screen.queryByRole('button');
    expect(btn).toBeNull();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Card onClick={handleClick}>Clickable</Card>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick on Enter key', () => {
    const handleClick = vi.fn();
    render(<Card onClick={handleClick}>Keyboard</Card>);
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick on Space key', () => {
    const handleClick = vi.fn();
    render(<Card onClick={handleClick}>Keyboard</Card>);
    fireEvent.keyDown(screen.getByRole('button'), { key: ' ' });
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is focusable when onClick is provided (tabIndex=0)', () => {
    const { container } = render(<Card onClick={() => {}}>Focusable</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.tabIndex).toBe(0);
  });
});

describe('CardHeader', () => {
  it('renders children', () => {
    render(<CardHeader>Header Content</CardHeader>);
    expect(screen.getByText('Header Content')).toBeTruthy();
  });

  it('applies custom className', () => {
    const { container } = render(
      <CardHeader className="custom-header">H</CardHeader>,
    );
    expect(container.querySelector('.custom-header')).toBeTruthy();
  });
});

describe('CardTitle', () => {
  it('renders as h3 element', () => {
    render(<CardTitle>Title</CardTitle>);
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toBeTruthy();
  });

  it('applies custom className', () => {
    const { container } = render(
      <CardTitle className="custom-title">T</CardTitle>,
    );
    expect(container.querySelector('.custom-title')).toBeTruthy();
  });
});
