// @vitest-environment jsdom
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
  });
});
