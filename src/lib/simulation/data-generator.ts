/* ═══════════════════════════════════════════════════════
   StadiumMind AI — Real-Time Data Generator
   Produces realistic, fluctuating stadium data for demo.
   ═══════════════════════════════════════════════════════ */

import type {
  StadiumData,
  GateStatus,
  ZoneDensity,
  FoodStall,
  WashroomStatus,
  SecurityAlert,
  MedicalIncident,
  VolunteerLocation,
  WeatherData,
  TransportStatus,
  MatchInfo,
  MatchEvent,
  IoTSensorData,
} from './types';
import { getTournamentContext } from './schedule';

/* ── Helpers ── */

let incidentCounter = 100;
function nextId(prefix: string): string {
  return `${prefix}-${++incidentCounter}`;
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min: number, max: number): number {
  return +(Math.random() * (max - min) + min).toFixed(1);
}

function pick<T>(arr: T[]): T {
  return arr[rand(0, arr.length - 1)];
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/** Smooth random walk: drift value up/down by a small %, clamped. */
function drift(current: number, maxDelta: number, min: number, max: number): number {
  const delta = (Math.random() - 0.5) * 2 * maxDelta;
  return clamp(Math.round(current + delta), min, max);
}

/* ═══════════════════════════════════════════════════════
   Stateful generator — keeps previous values so data
   evolves realistically across calls.
   ═══════════════════════════════════════════════════════ */

let _prev: StadiumData | null = null;

const ZONES = ['North Stand', 'South Stand', 'East Stand', 'West Stand', 'VIP Lounge', 'Fan Zone', 'Concourse A', 'Concourse B'];
const GATE_NAMES = ['Gate 1', 'Gate 2', 'Gate 3', 'Gate 4', 'Gate 5', 'Gate 6', 'Gate 7', 'Gate 8'];
const FOOD_STALLS: { name: string; cuisine: string; zone: string }[] = [
  { name: 'Taco Fiesta', cuisine: 'Mexican', zone: 'Concourse A' },
  { name: 'Burger Barn', cuisine: 'American', zone: 'Concourse B' },
  { name: 'Sushi Express', cuisine: 'Japanese', zone: 'East Stand' },
  { name: 'Pizza Roma', cuisine: 'Italian', zone: 'West Stand' },
  { name: 'Falafel House', cuisine: 'Middle Eastern', zone: 'North Stand' },
  { name: 'Noodle Bar', cuisine: 'Asian', zone: 'South Stand' },
  { name: 'Smoothie Station', cuisine: 'Beverages', zone: 'Fan Zone' },
  { name: 'Churros & Co', cuisine: 'Desserts', zone: 'Concourse A' },
];
const VOLUNTEER_NAMES = [
  'Maria G.', 'Ahmed K.', 'Yuki T.', 'Carlos R.', 'Priya S.',
  'James W.', 'Fatima A.', 'Hans M.', 'Mei L.', 'Oliver P.',
  'Sofia B.', 'Raj N.',
];
const LANGUAGES = ['English', 'Spanish', 'French', 'Arabic', 'Japanese', 'Hindi', 'Portuguese', 'German'];

/* ── Match simulation ── */

let matchMinute = 0;
let scoreA = 0;
let scoreB = 0;
const matchEvents: MatchEvent[] = [];

function evolveMatch(prev: MatchInfo, context: any): MatchInfo {
  const activeMatch = context.currentMatch || context.nextMatch;
  const teamA = activeMatch?.teamA || 'TBD';
  const teamB = activeMatch?.teamB || 'TBD';

  // Only advance the match if it's actually live
  if (context.stadiumMode === 'live') {
    matchMinute = prev.minute + rand(0, 2);
    if (matchMinute > 90) matchMinute = 90;
  } else {
    // If it's pre-match, reset match logic
    if (prev.status !== 'full-time') {
      matchMinute = 0;
      scoreA = 0;
      scoreB = 0;
    }
  }

  let status = prev.status;
  if (context.stadiumMode === 'pre-match' || context.stadiumMode === 'matchday') {
    status = 'pre-match';
  } else if (context.stadiumMode === 'post-match') {
    status = 'full-time';
  } else if (matchMinute <= 0) {
    status = 'pre-match';
  } else if (matchMinute <= 45) {
    status = 'first-half';
  } else if (matchMinute <= 50 && prev.status === 'first-half') {
    status = 'half-time';
  } else if (matchMinute <= 90) {
    status = 'second-half';
  } else {
    status = 'full-time';
  }

  // Random goal chance ~3% per tick
  if (status === 'first-half' || status === 'second-half') {
    if (Math.random() < 0.03) {
      const scoringTeam = Math.random() < 0.5 ? 'A' : 'B';
      if (scoringTeam === 'A') scoreA++;
      else scoreB++;
      matchEvents.push({
        minute: matchMinute,
        type: 'goal',
        team: scoringTeam === 'A' ? teamA : teamB,
        player: 'Player', // simplified for dynamic teams
        description: `⚽ GOAL! ${scoringTeam === 'A' ? teamA : teamB} scores!`,
      });
    }
    // Yellow card ~2%
    if (Math.random() < 0.02) {
      matchEvents.push({
        minute: matchMinute,
        type: 'yellow_card',
        team: pick([teamA, teamB]),
        player: 'Player',
        description: 'Yellow card issued',
      });
    }
  }

  return {
    teamA,
    teamB,
    scoreA,
    scoreB,
    minute: matchMinute,
    status,
    attendance: context.stadiumMode === 'live' ? rand(78000, 82000) : rand(10000, 42000),
    maxCapacity: context.venue.capacity || 85000,
    events: matchEvents.slice(-10),
  };
}

/* ── Generate full snapshot ── */

export function generateStadiumData(): StadiumData {
  const now = new Date().toISOString();
  const prev = _prev;
  const context = getTournamentContext();

  // If there's a match, use its details. If not, use the next one.
  const activeMatch = context.currentMatch || context.nextMatch;
  const isMatchActive = context.stadiumMode === 'live' || context.stadiumMode === 'matchday';
  const isIdle = context.stadiumMode === 'idle' || context.stadiumMode === 'post-match';

  // Match
  const match = prev && isMatchActive ? evolveMatch(prev.match, context) : {
    teamA: activeMatch?.teamA || 'TBD',
    teamB: activeMatch?.teamB || 'TBD',
    scoreA: 0,
    scoreB: 0,
    minute: 0,
    status: context.stadiumMode === 'live' ? ('first-half' as const) : ('pre-match' as const),
    attendance: isIdle ? 0 : isMatchActive ? 42000 : 500, // Small crowd for pre-match/idle
    maxCapacity: context.venue.capacity || 85000,
    events: [],
  };

  // Gates
  const gates: GateStatus[] = GATE_NAMES.map((name, i) => {
    if (isIdle) {
      return { id: `gate-${i + 1}`, name, scanRate: 0, queueLength: 0, capacity: 150, status: 'normal' };
    }
    const prevGate = prev?.gates[i];
    const scanRate = prevGate ? drift(prevGate.scanRate, 8, 10, 120) : rand(40, 100);
    const queueLength = prevGate ? drift(prevGate.queueLength, 30, 0, 500) : rand(20, 200);
    return {
      id: `gate-${i + 1}`,
      name,
      scanRate,
      queueLength,
      capacity: 150,
      status: queueLength > 350 ? 'critical' : queueLength > 200 ? 'busy' : 'normal',
    };
  });

  // Zones
  const zones: ZoneDensity[] = ZONES.map((name, i) => {
    const max = name === 'VIP Lounge' ? 2000 : name === 'Fan Zone' ? 5000 : rand(8000, 12000);
    if (isIdle) {
      return { id: `zone-${i}`, name, currentOccupancy: 0, maxCapacity: max, percentage: 0, trend: 'stable' };
    }
    const prevZone = prev?.zones[i];
    const occ = prevZone ? drift(prevZone.currentOccupancy, max * 0.03, 0, max) : rand(Math.floor(max * 0.4), Math.floor(max * 0.85));
    const pct = Math.round((occ / max) * 100);
    return {
      id: `zone-${i}`,
      name,
      currentOccupancy: occ,
      maxCapacity: max,
      percentage: pct,
      trend: prevZone ? (occ > prevZone.currentOccupancy + 50 ? 'rising' : occ < prevZone.currentOccupancy - 50 ? 'falling' : 'stable') : 'stable',
    };
  });

  // Food stalls
  const foodStalls: FoodStall[] = FOOD_STALLS.map((s, i) => {
    if (isIdle) {
      return { id: `food-${i}`, name: s.name, cuisine: s.cuisine, queueLength: 0, estimatedWaitMinutes: 0, status: 'closed', zone: s.zone };
    }
    const prevStall = prev?.foodStalls[i];
    const q = prevStall ? drift(prevStall.queueLength, 5, 0, 60) : rand(3, 30);
    return {
      id: `food-${i}`,
      name: s.name,
      cuisine: s.cuisine,
      queueLength: q,
      estimatedWaitMinutes: Math.round(q * 1.5),
      status: q > 40 ? 'busy' : q > 0 ? 'open' : 'closed',
      zone: s.zone,
    };
  });

  // Washrooms
  const washrooms: WashroomStatus[] = ZONES.slice(0, 6).flatMap((zone, zi) => {
    return (['male', 'female', 'accessible'] as const).map((gender, gi) => {
      const cap = gender === 'accessible' ? 4 : 20;
      if (isIdle) {
        return { id: `wr-${zi}-${gi}`, zone, gender, occupancy: 0, capacity: cap, queueLength: 0, status: 'available' };
      }
      const prevWR = prev?.washrooms[zi * 3 + gi];
      const occ = prevWR ? drift(prevWR.occupancy, 3, 0, cap) : rand(0, cap);
      const q = prevWR ? drift(prevWR.queueLength, 4, 0, 25) : rand(0, 15);
      return {
        id: `wr-${zi}-${gi}`,
        zone,
        gender,
        occupancy: occ,
        capacity: cap,
        queueLength: q,
        status: occ >= cap ? 'full' : occ > cap * 0.7 ? 'busy' : 'available',
      };
    });
  });

  // Security alerts (occasionally add new ones)
  const security: SecurityAlert[] = prev ? [...prev.security] : [];
  if (!isIdle && Math.random() < 0.08) {
    security.push({
      id: nextId('sec'),
      type: pick(['suspicious_activity', 'unattended_bag', 'crowd_surge', 'trespassing', 'general']),
      severity: pick(['low', 'medium', 'high']),
      zone: pick(ZONES),
      description: pick([
        'Unattended backpack reported near entrance',
        'Crowd density exceeding safe limits in concourse',
        'Unauthorized individual in restricted area',
        'Verbal altercation between spectators',
        'Suspicious package found near food court',
      ]),
      timestamp: now,
      status: 'active',
    });
  }
  // Resolve old alerts
  security.forEach((a) => {
    if (a.status === 'active' && Math.random() < 0.15) a.status = 'investigating';
    if (a.status === 'investigating' && Math.random() < 0.2) a.status = 'resolved';
  });
  const activeSecAlerts = security.filter((a) => a.status !== 'resolved').slice(-10);

  // Medical incidents
  const medical: MedicalIncident[] = prev ? [...prev.medical] : [];
  if (!isIdle && Math.random() < 0.05) {
    medical.push({
      id: nextId('med'),
      type: pick(['heat_exhaustion', 'injury', 'allergic_reaction', 'general']),
      severity: pick(['minor', 'moderate', 'severe']),
      zone: pick(ZONES),
      description: pick([
        'Spectator experiencing heat exhaustion',
        'Fall on staircase — possible sprain',
        'Allergic reaction reported at food stall',
        'Elderly spectator feeling dizzy',
        'Minor cut from broken seat armrest',
      ]),
      timestamp: now,
      status: 'reported',
      responseTimeMinutes: rand(1, 8),
    });
  }
  medical.forEach((m) => {
    if (m.status === 'reported' && Math.random() < 0.3) m.status = 'responding';
    if (m.status === 'responding' && Math.random() < 0.25) m.status = 'treating';
    if (m.status === 'treating' && Math.random() < 0.2) m.status = 'resolved';
  });
  const activeMedical = medical.filter((m) => m.status !== 'resolved').slice(-8);

  // Volunteers
  const volunteers: VolunteerLocation[] = VOLUNTEER_NAMES.map((name, i) => {
    const prevVol = prev?.volunteers[i];
    return {
      id: `vol-${i}`,
      name,
      role: pick(['guide', 'medic', 'security', 'general']),
      zone: prevVol && Math.random() > 0.15 ? prevVol.zone : pick(ZONES),
      status: isIdle ? 'on-break' : pick(['active', 'active', 'active', 'on-break', 'deployed']),
      language: [LANGUAGES[i % LANGUAGES.length], 'English'].filter((v, idx, a) => a.indexOf(v) === idx),
    };
  });

  // Weather
  const prevW = prev?.weather;
  const weather: WeatherData = {
    temperature: prevW ? drift(prevW.temperature, 0.5, 20, 42) : rand(28, 36),
    feelsLike: prevW ? drift(prevW.feelsLike, 0.5, 22, 46) : rand(30, 40),
    humidity: prevW ? drift(prevW.humidity, 2, 30, 80) : rand(40, 65),
    condition: pick(['sunny', 'sunny', 'partly_cloudy', 'cloudy']),
    windSpeed: prevW ? drift(prevW.windSpeed, 2, 0, 30) : rand(5, 15),
    uvIndex: rand(5, 11),
    heatAdvisory: false,
  };
  weather.heatAdvisory = weather.temperature > 38 || weather.feelsLike > 42;

  // Transport
  const transport: TransportStatus = {
    metro: {
      status: Math.random() < 0.05 ? 'delayed' : 'running',
      nextArrivalMinutes: rand(1, 8),
      crowding: isIdle ? 'low' : pick(['low', 'moderate', 'moderate', 'high']),
      line: 'Line 2 — Stadium Express',
    },
    parking: {
      totalSpaces: 12000,
      occupied: isIdle ? 50 : (prev ? drift(prev.transport.parking.occupied, 200, 4000, 12000) : rand(7000, 10000)),
      available: 0,
      percentage: 0,
    },
    busShuttle: {
      status: 'running',
      nextDepartureMinutes: rand(2, 12),
      capacity: 55,
      available: isIdle ? 50 : rand(10, 55),
    },
    rideshare: {
      estimatedWaitMinutes: isIdle ? 2 : rand(4, 25),
      surgeMultiplier: isIdle ? 1.0 : randFloat(1.0, 3.5),
    },
  };
  transport.parking.available = transport.parking.totalSpaces - transport.parking.occupied;
  transport.parking.percentage = Math.round((transport.parking.occupied / transport.parking.totalSpaces) * 100);

  // IoT
  const iot: IoTSensorData[] = ZONES.map((zone) => ({
    zone,
    temperature: randFloat(22, 38),
    humidity: randFloat(35, 75),
    noiseLevel: rand(60, 110),
    airQuality: rand(20, 120),
    lightLevel: rand(300, 1200),
  }));

  const totalInStadium = zones.reduce((sum, z) => sum + z.currentOccupancy, 0);

  const data: StadiumData = {
    timestamp: now,
    match,
    gates,
    zones,
    foodStalls,
    washrooms,
    security: activeSecAlerts,
    medical: activeMedical,
    volunteers,
    weather,
    transport,
    iot,
    totalInStadium,
    maxCapacity: context.venue.capacity,
    tournamentContext: context,
  };

  _prev = data;
  return data;
}

/** Reset the simulation state (useful for tests). */
export function resetSimulation(): void {
  _prev = null;
  matchMinute = 0;
  scoreA = 0;
  scoreB = 0;
  matchEvents.length = 0;
  incidentCounter = 100;
}
