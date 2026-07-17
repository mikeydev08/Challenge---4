// @vitest-environment jsdom
/* ═══════════════════════════════════════════════════════
   Tests — LiveIndicator Component
   ═══════════════════════════════════════════════════════ */

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LiveIndicator } from './LiveIndicator';

describe('LiveIndicator', () => {
  it('renders with default "LIVE" label', () => {
    render(<LiveIndicator />);
    expect(screen.getByText('LIVE')).toBeTruthy();
  });

  it('renders with custom label', () => {
    render(<LiveIndicator label="STREAMING" />);
    expect(screen.getByText('STREAMING')).toBeTruthy();
  });

  it('has correct ARIA label for accessibility', () => {
    render(<LiveIndicator />);
    const indicator = screen.getByLabelText(
      'LIVE - data is streaming in real time',
    );
    expect(indicator).toBeTruthy();
  });

  it('has custom ARIA label when label prop changes', () => {
    render(<LiveIndicator label="CONNECTED" />);
    const indicator = screen.getByLabelText(
      'CONNECTED - data is streaming in real time',
    );
    expect(indicator).toBeTruthy();
  });

  it('renders the pulsing dot element', () => {
    const { container } = render(<LiveIndicator />);
    const pingDot = container.querySelector('.animate-ping');
    expect(pingDot).toBeTruthy();
  });
});
