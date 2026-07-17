import { describe, it, expect } from 'vitest';
import { generateStadiumData } from './data-generator';

describe('data-generator', () => {
  it('generates valid stadium data', () => {
    const data = generateStadiumData();
    expect(data).toBeDefined();
    expect(data.timestamp).toBeDefined();
    expect(data.gates.length).toBeGreaterThan(0);
    expect(data.zones.length).toBeGreaterThan(0);
    expect(data.foodStalls.length).toBeGreaterThan(0);
  });
});
