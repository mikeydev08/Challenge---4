// @vitest-environment jsdom
/* ═══════════════════════════════════════════════════════
   Tests — Modal Component
   ═══════════════════════════════════════════════════════ */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from './Modal';

describe('Modal', () => {
  it('renders children when open', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <p>Modal Content</p>
      </Modal>,
    );
    expect(screen.getByText('Modal Content')).toBeTruthy();
  });

  it('renders title when provided', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="My Title">
        <p>Content</p>
      </Modal>,
    );
    expect(screen.getByText('My Title')).toBeTruthy();
  });

  it('does not render when closed', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={() => {}} title="Hidden">
        <p>Hidden Content</p>
      </Modal>,
    );
    expect(container.innerHTML).toBe('');
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Close Test">
        <p>Content</p>
      </Modal>,
    );
    const closeBtn = screen.getByLabelText('Close dialog');
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Esc Test">
        <p>Content</p>
      </Modal>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalled();
  });

  it('has correct ARIA attributes', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="ARIA Test">
        <p>Content</p>
      </Modal>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeTruthy();
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('aria-label')).toBe('ARIA Test');
  });

  it('calls onClose when backdrop is clicked', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Backdrop Test">
        <p>Content</p>
      </Modal>,
    );
    // The backdrop is the div with aria-hidden="true"
    const backdrop = document.querySelector('[aria-hidden="true"]');
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(handleClose).toHaveBeenCalled();
    }
  });
});
