// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle } from './Card';

describe('Card components', () => {
  it('renders Card components correctly', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>My Title</CardTitle>
        </CardHeader>
        <div>Content Body</div>
      </Card>
    );
    expect(screen.getByText('My Title')).toBeTruthy();
    expect(screen.getByText('Content Body')).toBeTruthy();
  });
});
