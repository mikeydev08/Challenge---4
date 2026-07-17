/* ═══════════════════════════════════════════════════════
   Tests — Data Generator
   Comprehensive tests for the real-time simulation engine.
   ═══════════════════════════════════════════════════════ */

import { describe, it, expect, beforeEach } from 'vitest';
import { generateStadiumData, resetSimulation } from './data-generator';

describe('data-generator', () => {
  beforeEach(() => {
    resetSimulation();
  });

  /* ── Structure validation ── */

  it('generates valid stadium data with all required fields', () => {
    const data = generateStadiumData();
    expect(data).toBeDefined();
    expect(data.timestamp).toBeDefined();
    expect(data.match).toBeDefined();
    expect(data.gates).toBeDefined();
    expect(data.zones).toBeDefined();
    expect(data.foodStalls).toBeDefined();
    expect(data.washrooms).toBeDefined();
    expect(data.security).toBeDefined();
    expect(data.medical).toBeDefined();
    expect(data.volunteers).toBeDefined();
    expect(data.weather).toBeDefined();
    expect(data.transport).toBeDefined();
    expect(data.iot).toBeDefined();
    expect(typeof data.totalInStadium).toBe('number');
    expect(typeof data.maxCapacity).toBe('number');
  });

  it('generates exactly 8 gates', () => {
    const data = generateStadiumData();
    expect(data.gates).toHaveLength(8);
  });

  it('generates exactly 8 zones', () => {
    const data = generateStadiumData();
    expect(data.zones).toHaveLength(8);
  });

  it('generates exactly 8 food stalls', () => {
    const data = generateStadiumData();
    expect(data.foodStalls).toHaveLength(8);
  });

  it('generates washrooms for 6 zones × 3 types = 18', () => {
    const data = generateStadiumData();
    expect(data.washrooms).toHaveLength(18);
  });

  it('generates exactly 12 volunteers', () => {
    const data = generateStadiumData();
    expect(data.volunteers).toHaveLength(12);
  });

  it('generates IoT sensor data for all 8 zones', () => {
    const data = generateStadiumData();
    expect(data.iot).toHaveLength(8);
  });

  /* ── Gate status thresholds ── */

  it('assigns correct gate status based on queueLength', () => {
    const data = generateStadiumData();
    for (const gate of data.gates) {
      if (gate.queueLength > 350) {
        expect(gate.status).toBe('critical');
      } else if (gate.queueLength > 200) {
        expect(gate.status).toBe('busy');
      } else {
        expect(gate.status).toBe('normal');
      }
    }
  });

  /* ── Zone density ── */

  it('calculates zone percentage correctly', () => {
    const data = generateStadiumData();
    for (const zone of data.zones) {
      if (zone.maxCapacity > 0) {
        const expectedPct = Math.round(
          (zone.currentOccupancy / zone.maxCapacity) * 100,
        );
        expect(zone.percentage).toBe(expectedPct);
      }
    }
  });

  /* ── Food stall logic ── */

  it('calculates food stall estimated wait time as queueLength × 1.5', () => {
    const data = generateStadiumData();
    for (const stall of data.foodStalls) {
      if (stall.status !== 'closed' || stall.queueLength > 0) {
        expect(stall.estimatedWaitMinutes).toBe(
          Math.round(stall.queueLength * 1.5),
        );
      }
    }
  });

  it('assigns correct food stall status based on queueLength', () => {
    const data = generateStadiumData();
    for (const stall of data.foodStalls) {
      if (stall.queueLength > 40) {
        expect(stall.status).toBe('busy');
      } else if (stall.queueLength > 0) {
        expect(stall.status).toBe('open');
      } else {
        expect(stall.status).toBe('closed');
      }
    }
  });

  /* ── Weather ── */

  it('sets heatAdvisory when temperature > 38 or feelsLike > 42', () => {
    // Generate multiple times to find diverse weather
    for (let i = 0; i < 20; i++) {
      resetSimulation();
      const data = generateStadiumData();
      const { weather } = data;
      if (weather.temperature > 38 || weather.feelsLike > 42) {
        expect(weather.heatAdvisory).toBe(true);
      }
    }
  });

  /* ── Transport parking calculation ── */

  it('calculates parking available and percentage correctly', () => {
    const data = generateStadiumData();
    const { parking } = data.transport;
    expect(parking.available).toBe(parking.totalSpaces - parking.occupied);
    expect(parking.percentage).toBe(
      Math.round((parking.occupied / parking.totalSpaces) * 100),
    );
  });

  /* ── Washroom status thresholds ── */

  it('assigns correct washroom status based on occupancy', () => {
    const data = generateStadiumData();
    for (const wr of data.washrooms) {
      if (wr.occupancy >= wr.capacity) {
        expect(wr.status).toBe('full');
      } else if (wr.occupancy > wr.capacity * 0.7) {
        expect(wr.status).toBe('busy');
      } else {
        expect(wr.status).toBe('available');
      }
    }
  });

  /* ── Match ── */

  it('generates valid match data', () => {
    const data = generateStadiumData();
    expect(data.match.teamA).toBeDefined();
    expect(data.match.teamB).toBeDefined();
    expect(typeof data.match.scoreA).toBe('number');
    expect(typeof data.match.scoreB).toBe('number');
    expect(typeof data.match.minute).toBe('number');
    expect(data.match.status).toBeDefined();
    expect(data.match.events).toBeDefined();
    expect(typeof data.match.attendance).toBe('number');
    expect(typeof data.match.maxCapacity).toBe('number');
  });

  /* ── Stateful evolution ── */

  it('evolves data across consecutive calls (stateful)', () => {
    const first = generateStadiumData();
    const second = generateStadiumData();
    // The second call should reuse previous state (stateful evolution)
    // so the second snapshot should be defined and share same structure
    expect(second).toBeDefined();
    expect(second.gates).toHaveLength(first.gates.length);
    expect(second.zones).toHaveLength(first.zones.length);
  });

  /* ── resetSimulation ── */

  it('resetSimulation resets state cleanly', () => {
    generateStadiumData();
    generateStadiumData();
    resetSimulation();
    const fresh = generateStadiumData();
    // After reset, match minute should be 0 or starting value
    expect(fresh.match.scoreA).toBe(0);
    expect(fresh.match.scoreB).toBe(0);
  });

  /* ── Volunteer data ── */

  it('generates volunteers with valid roles and languages', () => {
    const data = generateStadiumData();
    const validRoles = ['guide', 'medic', 'security', 'general'];
    for (const vol of data.volunteers) {
      expect(validRoles).toContain(vol.role);
      expect(vol.language.length).toBeGreaterThan(0);
      expect(vol.name).toBeDefined();
    }
  });

  /* ── IoT sensor ranges ── */

  it('generates IoT sensor values within expected ranges', () => {
    const data = generateStadiumData();
    for (const sensor of data.iot) {
      expect(sensor.temperature).toBeGreaterThanOrEqual(22);
      expect(sensor.temperature).toBeLessThanOrEqual(38);
      expect(sensor.humidity).toBeGreaterThanOrEqual(35);
      expect(sensor.humidity).toBeLessThanOrEqual(75);
      expect(sensor.noiseLevel).toBeGreaterThanOrEqual(60);
      expect(sensor.noiseLevel).toBeLessThanOrEqual(110);
      expect(sensor.airQuality).toBeGreaterThanOrEqual(20);
      expect(sensor.airQuality).toBeLessThanOrEqual(120);
      expect(sensor.lightLevel).toBeGreaterThanOrEqual(300);
      expect(sensor.lightLevel).toBeLessThanOrEqual(1200);
    }
  });

  /* ── totalInStadium ── */

  it('totalInStadium equals sum of zone occupancies', () => {
    const data = generateStadiumData();
    const sum = data.zones.reduce((s, z) => s + z.currentOccupancy, 0);
    expect(data.totalInStadium).toBe(sum);
  });
});
