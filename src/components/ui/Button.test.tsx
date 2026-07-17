// @vitest-environment jsdom
/* ═══════════════════════════════════════════════════════
   Tests — Button Component
   ═══════════════════════════════════════════════════════ */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeTruthy();
  });

  it('renders as a button element', () => {
    render(<Button>Test</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeTruthy();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveProperty('disabled', true);
  });

  it('is disabled when loading is true', () => {
    render(<Button loading>Loading</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveProperty('disabled', true);
  });

  it('shows spinner SVG when loading', () => {
    const { container } = render(<Button loading>Loading</Button>);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('renders icon when provided', () => {
    render(<Button icon={<span data-testid="icon">★</span>}>With Icon</Button>);
    expect(screen.getByTestId('icon')).toBeTruthy();
  });

  it('applies custom className', () => {
    const { container } = render(<Button className="custom-class">Test</Button>);
    expect(container.firstChild?.toString()).toBeDefined();
    const btn = container.querySelector('.custom-class');
    expect(btn).toBeTruthy();
  });
});
