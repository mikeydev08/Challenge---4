'use client';

import { useEffect } from 'react';
import { useAccessibilityStore } from '@/lib/store/accessibility-store';

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const { fontSize, highContrast, reducedMotion } = useAccessibilityStore();

  useEffect(() => {
    const root = document.documentElement;
    
    // Handle Font Size
    if (fontSize === 'large') {
      root.classList.add('large-text');
      root.classList.remove('extra-large-text');
    } else if (fontSize === 'extra-large') {
      root.classList.add('large-text', 'extra-large-text');
    } else {
      root.classList.remove('large-text', 'extra-large-text');
    }

    // Handle High Contrast
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Handle Reduced Motion
    if (reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
  }, [fontSize, highContrast, reducedMotion]);

  return <>{children}</>;
}
