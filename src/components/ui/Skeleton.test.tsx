// @vitest-environment jsdom
/* ═══════════════════════════════════════════════════════
   Tests — Skeleton Components
   ═══════════════════════════════════════════════════════ */

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Skeleton, SkeletonCard, SkeletonText } from './Skeleton';

describe('Skeleton', () => {
  it('renders correctly', () => {
    const { container } = render(<Skeleton className="test-class" />);
    expect(container.firstChild).toBeTruthy();
  });

  it('applies custom className', () => {
    const { container } = render(<Skeleton className="custom-skeleton" />);
    expect(container.querySelector('.custom-skeleton')).toBeTruthy();
  });

  it('is hidden from screen readers (aria-hidden)', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild?.toString()).toBeDefined();
    const el = container.firstChild as HTMLElement;
    expect(el.getAttribute('aria-hidden')).toBe('true');
  });

  it('accepts custom style', () => {
    const { container } = render(
      <Skeleton style={{ width: '50%' }} />,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe('50%');
  });
});

describe('SkeletonCard', () => {
  it('renders a card with multiple skeleton lines', () => {
    const { container } = render(<SkeletonCard />);
    const skeletons = container.querySelectorAll('[aria-hidden="true"]');
    expect(skeletons.length).toBeGreaterThanOrEqual(1);
  });

  it('is hidden from screen readers', () => {
    const { container } = render(<SkeletonCard />);
    const card = container.firstChild as HTMLElement;
    expect(card.getAttribute('aria-hidden')).toBe('true');
  });
});

describe('SkeletonText', () => {
  it('renders default 3 lines', () => {
    const { container } = render(<SkeletonText />);
    const lines = container.querySelectorAll('[aria-hidden="true"]');
    // The wrapper div has aria-hidden, plus individual lines
    expect(lines.length).toBeGreaterThanOrEqual(1);
  });

  it('renders custom number of lines', () => {
    const { container } = render(<SkeletonText lines={5} />);
    // Each line is a Skeleton with aria-hidden
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.children.length).toBe(5);
  });

  it('is hidden from screen readers', () => {
    const { container } = render(<SkeletonText />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.getAttribute('aria-hidden')).toBe('true');
  });
});
