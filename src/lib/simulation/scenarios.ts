/* ═══════════════════════════════════════════════════════
   StadiumMind AI — Pre-built Scenarios
   ═══════════════════════════════════════════════════════ */

export interface Scenario {
  id: string;
  name: string;
  description: string;
  icon: string;
  overrides: Record<string, unknown>;
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'pre-match-rush',
    name: 'Pre-Match Rush',
    description: 'Gates are flooding with fans 30 minutes before kickoff. Queue management is critical.',
    icon: '🏃',
    overrides: {
      matchMinute: 0,
      gateQueueMultiplier: 2.5,
      zoneDensityMultiplier: 0.6,
    },
  },
  {
    id: 'half-time-surge',
    name: 'Half-Time Surge',
    description: 'Half-time break — massive queues at food stalls and washrooms.',
    icon: '🍔',
    overrides: {
      matchMinute: 46,
      foodQueueMultiplier: 3.0,
      washroomQueueMultiplier: 2.5,
      zoneDensityMultiplier: 0.8,
    },
  },
  {
    id: 'post-match-exodus',
    name: 'Post-Match Exodus',
    description: 'Full-time whistle — 80,000 fans heading to exits simultaneously.',
    icon: '🚪',
    overrides: {
      matchMinute: 91,
      gateQueueMultiplier: 3.0,
      transportCrowding: 'high',
      parkingOccupancy: 0.95,
    },
  },
  {
    id: 'emergency-drill',
    name: 'Emergency Drill',
    description: 'Severe weather warning — evacuation protocol activated.',
    icon: '🚨',
    overrides: {
      weather: { condition: 'thunderstorm', windSpeed: 45 },
      emergencyAlert: true,
      securityLevel: 'critical',
    },
  },
  {
    id: 'peak-capacity',
    name: 'Peak Capacity',
    description: 'Stadium at 97% capacity during group stage decider.',
    icon: '📊',
    overrides: {
      zoneDensityMultiplier: 1.4,
      parkingOccupancy: 0.98,
      foodQueueMultiplier: 2.0,
    },
  },
  {
    id: 'heat-wave',
    name: 'Heat Wave',
    description: 'Temperature exceeds 40°C. Medical incidents rising.',
    icon: '🌡️',
    overrides: {
      weather: { temperature: 42, feelsLike: 48, humidity: 70, uvIndex: 11, heatAdvisory: true },
      medicalIncidentRate: 3.0,
    },
  },
];
