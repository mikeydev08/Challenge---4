// @vitest-environment jsdom
/* ═══════════════════════════════════════════════════════
   Tests — ThemeToggle Component
   ═══════════════════════════════════════════════════════ */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  it('renders all three theme options', () => {
    render(<ThemeToggle theme="dark" onChange={() => {}} />);
    expect(screen.getByLabelText('Dark mode')).toBeTruthy();
    expect(screen.getByLabelText('Light mode')).toBeTruthy();
    expect(screen.getByLabelText('System preference')).toBeTruthy();
  });

  it('has a radiogroup role', () => {
    render(<ThemeToggle theme="dark" onChange={() => {}} />);
    const group = screen.getByRole('radiogroup');
    expect(group).toBeTruthy();
  });

  it('marks the active theme as checked', () => {
    render(<ThemeToggle theme="light" onChange={() => {}} />);
    const lightBtn = screen.getByLabelText('Light mode');
    expect(lightBtn.getAttribute('aria-checked')).toBe('true');
    const darkBtn = screen.getByLabelText('Dark mode');
    expect(darkBtn.getAttribute('aria-checked')).toBe('false');
  });

  it('calls onChange with the selected theme', () => {
    const handleChange = vi.fn();
    render(<ThemeToggle theme="dark" onChange={handleChange} />);
    fireEvent.click(screen.getByLabelText('Light mode'));
    expect(handleChange).toHaveBeenCalledWith('light');
  });

  it('calls onChange with system theme', () => {
    const handleChange = vi.fn();
    render(<ThemeToggle theme="dark" onChange={handleChange} />);
    fireEvent.click(screen.getByLabelText('System preference'));
    expect(handleChange).toHaveBeenCalledWith('system');
  });

  it('each option has radio role', () => {
    render(<ThemeToggle theme="dark" onChange={() => {}} />);
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(3);
  });
});
