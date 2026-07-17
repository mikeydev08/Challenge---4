/* ═══════════════════════════════════════════════════════
   Simulation Types — StadiumMind AI
   All data structures for the real-time stadium simulation.
   ═══════════════════════════════════════════════════════ */

export interface GateStatus {
  id: string;
  name: string;
  scanRate: number;       // scans per minute
  queueLength: number;    // people in queue
  capacity: number;       // max throughput
  status: 'normal' | 'busy' | 'critical';
}

export interface ZoneDensity {
  id: string;
  name: string;
  currentOccupancy: number;
  maxCapacity: number;
  percentage: number;
  trend: 'rising' | 'stable' | 'falling';
}

export interface FoodStall {
  id: string;
  name: string;
  cuisine: string;
  queueLength: number;
  estimatedWaitMinutes: number;
  status: 'open' | 'busy' | 'closed';
  zone: string;
}

export interface WashroomStatus {
  id: string;
  zone: string;
  gender: 'male' | 'female' | 'accessible';
  occupancy: number;
  capacity: number;
  queueLength: number;
  status: 'available' | 'busy' | 'full';
}

export interface SecurityAlert {
  id: string;
  type: 'suspicious_activity' | 'unattended_bag' | 'crowd_surge' | 'fight' | 'trespassing' | 'general';
  severity: 'low' | 'medium' | 'high' | 'critical';
  zone: string;
  description: string;
  timestamp: string;
  status: 'active' | 'investigating' | 'resolved';
}

export interface MedicalIncident {
  id: string;
  type: 'heat_exhaustion' | 'injury' | 'cardiac' | 'allergic_reaction' | 'general';
  severity: 'minor' | 'moderate' | 'severe';
  zone: string;
  description: string;
  timestamp: string;
  status: 'reported' | 'responding' | 'treating' | 'resolved';
  responseTimeMinutes: number;
}

export interface VolunteerLocation {
  id: string;
  name: string;
  role: 'guide' | 'medic' | 'security' | 'general';
  zone: string;
  status: 'active' | 'on-break' | 'deployed';
  language: string[];
}

export interface WeatherData {
  temperature: number;     // Celsius
  feelsLike: number;
  humidity: number;        // percentage
  condition: 'sunny' | 'cloudy' | 'partly_cloudy' | 'rainy' | 'thunderstorm';
  windSpeed: number;       // km/h
  uvIndex: number;
  heatAdvisory: boolean;
}

export interface TransportStatus {
  metro: {
    status: 'running' | 'delayed' | 'suspended';
    nextArrivalMinutes: number;
    crowding: 'low' | 'moderate' | 'high';
    line: string;
  };
  parking: {
    totalSpaces: number;
    occupied: number;
    available: number;
    percentage: number;
  };
  busShuttle: {
    status: 'running' | 'delayed';
    nextDepartureMinutes: number;
    capacity: number;
    available: number;
  };
  rideshare: {
    estimatedWaitMinutes: number;
    surgeMultiplier: number;
  };
}

export interface MatchInfo {
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  minute: number;
  status: 'pre-match' | 'first-half' | 'half-time' | 'second-half' | 'full-time' | 'extra-time';
  attendance: number;
  maxCapacity: number;
  events: MatchEvent[];
}

export interface MatchEvent {
  minute: number;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'var_review';
  team: string;
  player: string;
  description: string;
}

export interface IoTSensorData {
  zone: string;
  temperature: number;
  humidity: number;
  noiseLevel: number;     // decibels
  airQuality: number;     // AQI
  lightLevel: number;     // lux
}

import type { TournamentContext } from './schedule';

export interface StadiumData {
  timestamp: string;
  match: MatchInfo;
  gates: GateStatus[];
  zones: ZoneDensity[];
  foodStalls: FoodStall[];
  washrooms: WashroomStatus[];
  security: SecurityAlert[];
  medical: MedicalIncident[];
  volunteers: VolunteerLocation[];
  weather: WeatherData;
  transport: TransportStatus;
  iot: IoTSensorData[];
  totalInStadium: number;
  maxCapacity: number;
  tournamentContext?: TournamentContext;
}

/* ── Fan profile types ── */

export interface FanProfile {
  name: string;
  ticketId: string;
  seatSection: string;
  seatRow: string;
  seatNumber: string;
  preferredLanguage: string;
  dietaryPreferences: string[];
  mobilityLimitations: string[];
  favoriteTeam: string;
  currentZone: string;
}

/* ── AI response types ── */

export interface AIInsight {
  id: string;
  priority: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  reasoning: string;
  suggestedAction: string;
  affectedZones: string[];
  timestamp: string;
  status: 'pending' | 'approved' | 'modified' | 'rejected';
}

export interface Announcement {
  id: string;
  original: string;
  translations: Record<string, string>;
  priority: 'routine' | 'important' | 'urgent' | 'emergency';
  timestamp: string;
}
