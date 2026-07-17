// @vitest-environment jsdom
/* ═══════════════════════════════════════════════════════
   Tests — Gauge Component
   ═══════════════════════════════════════════════════════ */

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Gauge, LinearGauge } from './Gauge';

describe('Gauge', () => {
  it('renders with a value and label', () => {
    render(<Gauge value={75} label="Capacity" />);
    expect(screen.getByText('Capacity')).toBeTruthy();
  });

  it('displays the rounded numeric value', () => {
    render(<Gauge value={72} label="Test" />);
    expect(screen.getByText('72')).toBeTruthy();
  });

  it('renders with ARIA meter role and attributes', () => {
    const { container } = render(<Gauge value={50} label="Occupancy" />);
    const meter = container.querySelector('[role="meter"]');
    expect(meter).toBeTruthy();
    expect(meter?.getAttribute('aria-valuenow')).toBe('50');
    expect(meter?.getAttribute('aria-valuemin')).toBe('0');
    expect(meter?.getAttribute('aria-valuemax')).toBe('100');
  });

  it('clamps value to 0-max range', () => {
    const { container } = render(<Gauge value={-10} label="Negative" />);
    const meter = container.querySelector('[role="meter"]');
    expect(meter?.getAttribute('aria-valuenow')).toBe('0');
  });

  it('clamps value to max when exceeding', () => {
    const { container } = render(<Gauge value={150} max={100} label="Over" />);
    const meter = container.querySelector('[role="meter"]');
    expect(meter?.getAttribute('aria-valuenow')).toBe('100');
  });

  it('renders with custom suffix', () => {
    render(<Gauge value={42} label="Temperature" suffix="°C" />);
    expect(screen.getByText('°C')).toBeTruthy();
  });

  it('hides value when showValue is false', () => {
    const { container } = render(
      <Gauge value={50} label="Hidden" showValue={false} />,
    );
    // Should not render the value text container
    const valueDisplay = container.querySelector('.absolute.inset-0');
    expect(valueDisplay).toBeNull();
  });
});

describe('LinearGauge', () => {
  it('renders with ARIA meter role', () => {
    const { container } = render(<LinearGauge value={60} />);
    const meter = container.querySelector('[role="meter"]');
    expect(meter).toBeTruthy();
  });

  it('renders with correct ARIA attributes', () => {
    const { container } = render(<LinearGauge value={30} max={100} />);
    const meter = container.querySelector('[role="meter"]');
    expect(meter?.getAttribute('aria-valuenow')).toBe('30');
    expect(meter?.getAttribute('aria-valuemax')).toBe('100');
  });

  it('applies custom className', () => {
    const { container } = render(
      <LinearGauge value={50} className="my-gauge" />,
    );
    const gauge = container.querySelector('.my-gauge');
    expect(gauge).toBeTruthy();
  });
});
