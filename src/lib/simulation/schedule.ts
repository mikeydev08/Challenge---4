/* ═══════════════════════════════════════════════════════
   StadiumMind AI — FIFA World Cup 2026 Schedule
   REAL tournament data from the 2026 FIFA World Cup.
   Auto-detects current phase from system clock.
   ═══════════════════════════════════════════════════════ */

export interface ScheduledMatch {
  id: string;
  round: string;
  date: string;        // ISO date: YYYY-MM-DD
  kickoff: string;     // Local time: HH:MM
  teamA: string;
  teamB: string;
  flagA: string;
  flagB: string;
  venue: string;
  city: string;
  capacity: number;
  status: 'upcoming' | 'today' | 'live' | 'completed';
  scoreA?: number;
  scoreB?: number;
  penalties?: string;  // e.g. "4-3" if decided on pens
  extraTime?: boolean;
}

export interface TournamentContext {
  currentPhase: string;
  currentMatch: ScheduledMatch | null;
  nextMatch: ScheduledMatch | null;
  todayMatches: ScheduledMatch[];
  upcomingMatches: ScheduledMatch[];
  completedMatches: ScheduledMatch[];
  venue: {
    name: string;
    city: string;
    capacity: number;
    timezone: string;
  };
  stadiumMode: 'idle' | 'pre-match' | 'matchday' | 'live' | 'post-match';
  hoursUntilNextMatch: number;
  tournamentDay: number;       // Day of the tournament (1–39)
  matchesPlayed: number;
  matchesRemaining: number;
  bracket: BracketData;
}

export interface BracketData {
  quarterFinals: ScheduledMatch[];
  semiFinals: ScheduledMatch[];
  thirdPlace: ScheduledMatch | null;
  final: ScheduledMatch | null;
}

/* ── FIFA World Cup 2026 Venues ── */

const VENUES = {
  metlife:     { name: 'MetLife Stadium',                   city: 'East Rutherford, NJ', capacity: 82500, timezone: 'America/New_York' },
  sofi:        { name: 'SoFi Stadium',                      city: 'Inglewood, CA',       capacity: 70240, timezone: 'America/Los_Angeles' },
  at_and_t:    { name: 'AT&T Stadium',                      city: 'Arlington, TX',       capacity: 80000, timezone: 'America/Chicago' },
  azteca:      { name: 'Estadio Azteca',                    city: 'Mexico City, Mexico', capacity: 87523, timezone: 'America/Mexico_City' },
  bmo:         { name: 'BMO Field',                         city: 'Toronto, Canada',     capacity: 45500, timezone: 'America/Toronto' },
  hard_rock:   { name: 'Hard Rock Stadium',                 city: 'Miami, FL',           capacity: 64767, timezone: 'America/New_York' },
  lumen:       { name: 'Lumen Field',                       city: 'Seattle, WA',         capacity: 68740, timezone: 'America/Los_Angeles' },
  lincoln:     { name: 'Lincoln Financial Field',           city: 'Philadelphia, PA',    capacity: 69176, timezone: 'America/New_York' },
  mercedes:    { name: 'Mercedes-Benz Stadium',             city: 'Atlanta, GA',         capacity: 71000, timezone: 'America/New_York' },
  gillette:    { name: 'Gillette Stadium',                  city: 'Foxborough, MA',      capacity: 65878, timezone: 'America/New_York' },
  arrowhead:   { name: 'GEHA Field at Arrowhead Stadium',   city: 'Kansas City, MO',     capacity: 76416, timezone: 'America/Chicago' },
  nrg:         { name: 'NRG Stadium',                       city: 'Houston, TX',         capacity: 72220, timezone: 'America/Chicago' },
  levis:       { name: "Levi's Stadium",                    city: 'Santa Clara, CA',     capacity: 68500, timezone: 'America/Los_Angeles' },
  bc_place:    { name: 'BC Place',                          city: 'Vancouver, Canada',   capacity: 54500, timezone: 'America/Vancouver' },
  guadalajara: { name: 'Estadio Akron',                     city: 'Guadalajara, Mexico', capacity: 49850, timezone: 'America/Mexico_City' },
  monterrey:   { name: 'Estadio BBVA',                      city: 'Monterrey, Mexico',   capacity: 53500, timezone: 'America/Monterrey' },
};

/* ══════════════════════════════════════════════════════════
   REAL 2026 FIFA World Cup Knockout Stage Results
   Sources: FIFA.com, Wikipedia, Olympics.com
   ══════════════════════════════════════════════════════════ */

const SCHEDULE: ScheduledMatch[] = [

  // ──────────────────────────────────────
  // ROUND OF 32 (June 28 – July 3, 2026)
  // ──────────────────────────────────────
  {
    id: 'r32-1', round: 'Round of 32', date: '2026-06-28', kickoff: '16:00',
    teamA: 'South Africa', teamB: 'Canada', flagA: '🇿🇦', flagB: '🇨🇦',
    venue: 'BMO Field', city: 'Toronto, Canada', capacity: 45500,
    status: 'completed', scoreA: 0, scoreB: 1,
  },
  {
    id: 'r32-2', round: 'Round of 32', date: '2026-06-29', kickoff: '14:00',
    teamA: 'Germany', teamB: 'Paraguay', flagA: '🇩🇪', flagB: '🇵🇾',
    venue: 'NRG Stadium', city: 'Houston, TX', capacity: 72220,
    status: 'completed', scoreA: 1, scoreB: 1, penalties: '3-4',
  },
  {
    id: 'r32-3', round: 'Round of 32', date: '2026-06-29', kickoff: '18:00',
    teamA: 'Brazil', teamB: 'Japan', flagA: '🇧🇷', flagB: '🇯🇵',
    venue: 'SoFi Stadium', city: 'Inglewood, CA', capacity: 70240,
    status: 'completed', scoreA: 2, scoreB: 1,
  },
  {
    id: 'r32-4', round: 'Round of 32', date: '2026-06-30', kickoff: '14:00',
    teamA: 'Netherlands', teamB: 'Morocco', flagA: '🇳🇱', flagB: '🇲🇦',
    venue: 'MetLife Stadium', city: 'East Rutherford, NJ', capacity: 82500,
    status: 'completed', scoreA: 1, scoreB: 1, penalties: '2-3',
  },
  {
    id: 'r32-5', round: 'Round of 32', date: '2026-06-30', kickoff: '18:00',
    teamA: 'France', teamB: 'Sweden', flagA: '🇫🇷', flagB: '🇸🇪',
    venue: 'Lincoln Financial Field', city: 'Philadelphia, PA', capacity: 69176,
    status: 'completed', scoreA: 3, scoreB: 0,
  },
  {
    id: 'r32-6', round: 'Round of 32', date: '2026-07-01', kickoff: '14:00',
    teamA: 'Ivory Coast', teamB: 'Norway', flagA: '🇨🇮', flagB: '🇳🇴',
    venue: 'Mercedes-Benz Stadium', city: 'Atlanta, GA', capacity: 71000,
    status: 'completed', scoreA: 1, scoreB: 2,
  },
  {
    id: 'r32-7', round: 'Round of 32', date: '2026-07-01', kickoff: '18:00',
    teamA: 'Mexico', teamB: 'Ecuador', flagA: '🇲🇽', flagB: '🇪🇨',
    venue: 'Estadio Azteca', city: 'Mexico City, Mexico', capacity: 87523,
    status: 'completed', scoreA: 2, scoreB: 0,
  },
  {
    id: 'r32-8', round: 'Round of 32', date: '2026-07-01', kickoff: '21:00',
    teamA: 'England', teamB: 'DR Congo', flagA: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', flagB: '🇨🇩',
    venue: 'Gillette Stadium', city: 'Foxborough, MA', capacity: 65878,
    status: 'completed', scoreA: 2, scoreB: 1,
  },
  {
    id: 'r32-9', round: 'Round of 32', date: '2026-07-02', kickoff: '14:00',
    teamA: 'USA', teamB: 'Bosnia and Herzegovina', flagA: '🇺🇸', flagB: '🇧🇦',
    venue: 'AT&T Stadium', city: 'Arlington, TX', capacity: 80000,
    status: 'completed', scoreA: 2, scoreB: 0,
  },
  {
    id: 'r32-10', round: 'Round of 32', date: '2026-07-02', kickoff: '17:00',
    teamA: 'Belgium', teamB: 'Senegal', flagA: '🇧🇪', flagB: '🇸🇳',
    venue: 'Hard Rock Stadium', city: 'Miami, FL', capacity: 64767,
    status: 'completed', scoreA: 3, scoreB: 2, extraTime: true,
  },
  {
    id: 'r32-11', round: 'Round of 32', date: '2026-07-02', kickoff: '20:00',
    teamA: 'Spain', teamB: 'Austria', flagA: '🇪🇸', flagB: '🇦🇹',
    venue: 'Lumen Field', city: 'Seattle, WA', capacity: 68740,
    status: 'completed', scoreA: 3, scoreB: 0,
  },
  {
    id: 'r32-12', round: 'Round of 32', date: '2026-07-03', kickoff: '13:00',
    teamA: 'Portugal', teamB: 'Croatia', flagA: '🇵🇹', flagB: '🇭🇷',
    venue: 'GEHA Field at Arrowhead Stadium', city: 'Kansas City, MO', capacity: 76416,
    status: 'completed', scoreA: 2, scoreB: 1,
  },
  {
    id: 'r32-13', round: 'Round of 32', date: '2026-07-03', kickoff: '16:00',
    teamA: 'Switzerland', teamB: 'Algeria', flagA: '🇨🇭', flagB: '🇩🇿',
    venue: 'BC Place', city: 'Vancouver, Canada', capacity: 54500,
    status: 'completed', scoreA: 2, scoreB: 0,
  },
  {
    id: 'r32-14', round: 'Round of 32', date: '2026-07-03', kickoff: '19:00',
    teamA: 'Australia', teamB: 'Egypt', flagA: '🇦🇺', flagB: '🇪🇬',
    venue: 'Estadio Akron', city: 'Guadalajara, Mexico', capacity: 49850,
    status: 'completed', scoreA: 1, scoreB: 1, penalties: '2-4',
  },
  {
    id: 'r32-15', round: 'Round of 32', date: '2026-07-03', kickoff: '22:00',
    teamA: 'Argentina', teamB: 'Cabo Verde', flagA: '🇦🇷', flagB: '🇨🇻',
    venue: 'Hard Rock Stadium', city: 'Miami, FL', capacity: 64767,
    status: 'completed', scoreA: 3, scoreB: 2, extraTime: true,
  },
  {
    id: 'r32-16', round: 'Round of 32', date: '2026-07-03', kickoff: '22:00',
    teamA: 'Colombia', teamB: 'Ghana', flagA: '🇨🇴', flagB: '🇬🇭',
    venue: 'Estadio BBVA', city: 'Monterrey, Mexico', capacity: 53500,
    status: 'completed', scoreA: 1, scoreB: 0,
  },

  // ──────────────────────────────────────
  // ROUND OF 16 (July 4 – July 7, 2026)
  // ──────────────────────────────────────
  {
    id: 'r16-1', round: 'Round of 16', date: '2026-07-04', kickoff: '18:00',
    teamA: 'Canada', teamB: 'Morocco', flagA: '🇨🇦', flagB: '🇲🇦',
    venue: 'NRG Stadium', city: 'Houston, TX', capacity: 72220,
    status: 'completed', scoreA: 0, scoreB: 3,
  },
  {
    id: 'r16-2', round: 'Round of 16', date: '2026-07-04', kickoff: '21:00',
    teamA: 'Paraguay', teamB: 'France', flagA: '🇵🇾', flagB: '🇫🇷',
    venue: 'Lincoln Financial Field', city: 'Philadelphia, PA', capacity: 69176,
    status: 'completed', scoreA: 0, scoreB: 1,
  },
  {
    id: 'r16-3', round: 'Round of 16', date: '2026-07-05', kickoff: '18:00',
    teamA: 'Brazil', teamB: 'Norway', flagA: '🇧🇷', flagB: '🇳🇴',
    venue: 'MetLife Stadium', city: 'East Rutherford, NJ', capacity: 82500,
    status: 'completed', scoreA: 1, scoreB: 2,
  },
  {
    id: 'r16-4', round: 'Round of 16', date: '2026-07-05', kickoff: '21:00',
    teamA: 'Mexico', teamB: 'England', flagA: '🇲🇽', flagB: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    venue: 'Estadio Azteca', city: 'Mexico City, Mexico', capacity: 87523,
    status: 'completed', scoreA: 2, scoreB: 3,
  },
  {
    id: 'r16-5', round: 'Round of 16', date: '2026-07-06', kickoff: '18:00',
    teamA: 'Portugal', teamB: 'Spain', flagA: '🇵🇹', flagB: '🇪🇸',
    venue: 'AT&T Stadium', city: 'Arlington, TX', capacity: 80000,
    status: 'completed', scoreA: 0, scoreB: 1,
  },
  {
    id: 'r16-6', round: 'Round of 16', date: '2026-07-06', kickoff: '21:00',
    teamA: 'USA', teamB: 'Belgium', flagA: '🇺🇸', flagB: '🇧🇪',
    venue: 'Lumen Field', city: 'Seattle, WA', capacity: 68740,
    status: 'completed', scoreA: 1, scoreB: 4,
  },
  {
    id: 'r16-7', round: 'Round of 16', date: '2026-07-07', kickoff: '18:00',
    teamA: 'Argentina', teamB: 'Egypt', flagA: '🇦🇷', flagB: '🇪🇬',
    venue: 'Mercedes-Benz Stadium', city: 'Atlanta, GA', capacity: 71000,
    status: 'completed', scoreA: 3, scoreB: 2,
  },
  {
    id: 'r16-8', round: 'Round of 16', date: '2026-07-07', kickoff: '21:00',
    teamA: 'Switzerland', teamB: 'Colombia', flagA: '🇨🇭', flagB: '🇨🇴',
    venue: 'BC Place', city: 'Vancouver, Canada', capacity: 54500,
    status: 'completed', scoreA: 0, scoreB: 0, penalties: '4-3',
  },

  // ──────────────────────────────────────
  // QUARTER-FINALS (July 9 – July 11, 2026)
  // ──────────────────────────────────────
  {
    id: 'qf1', round: 'Quarter-Final', date: '2026-07-09', kickoff: '18:00',
    teamA: 'France', teamB: 'Morocco', flagA: '🇫🇷', flagB: '🇲🇦',
    venue: 'Gillette Stadium', city: 'Foxborough, MA', capacity: 65878,
    status: 'completed', scoreA: 2, scoreB: 0,
  },
  {
    id: 'qf2', round: 'Quarter-Final', date: '2026-07-10', kickoff: '21:00',
    teamA: 'Spain', teamB: 'Belgium', flagA: '🇪🇸', flagB: '🇧🇪',
    venue: 'SoFi Stadium', city: 'Inglewood, CA', capacity: 70240,
    status: 'completed', scoreA: 2, scoreB: 1,
  },
  {
    id: 'qf3', round: 'Quarter-Final', date: '2026-07-11', kickoff: '18:00',
    teamA: 'England', teamB: 'Norway', flagA: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', flagB: '🇳🇴',
    venue: 'Hard Rock Stadium', city: 'Miami, FL', capacity: 64767,
    status: 'completed', scoreA: 2, scoreB: 1, extraTime: true,
  },
  {
    id: 'qf4', round: 'Quarter-Final', date: '2026-07-11', kickoff: '21:00',
    teamA: 'Argentina', teamB: 'Switzerland', flagA: '🇦🇷', flagB: '🇨🇭',
    venue: 'GEHA Field at Arrowhead Stadium', city: 'Kansas City, MO', capacity: 76416,
    status: 'completed', scoreA: 3, scoreB: 1, extraTime: true,
  },

  // ──────────────────────────────────────
  // SEMI-FINALS (July 14 – July 15, 2026)
  // ──────────────────────────────────────
  {
    id: 'sf1', round: 'Semi-Final', date: '2026-07-14', kickoff: '20:00',
    teamA: 'Spain', teamB: 'France', flagA: '🇪🇸', flagB: '🇫🇷',
    venue: 'AT&T Stadium', city: 'Arlington, TX', capacity: 80000,
    status: 'completed', scoreA: 2, scoreB: 0,
  },
  {
    id: 'sf2', round: 'Semi-Final', date: '2026-07-15', kickoff: '20:00',
    teamA: 'Argentina', teamB: 'England', flagA: '🇦🇷', flagB: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    venue: 'Mercedes-Benz Stadium', city: 'Atlanta, GA', capacity: 71000,
    status: 'completed', scoreA: 2, scoreB: 1,
  },

  // ──────────────────────────────────────
  // THIRD-PLACE PLAY-OFF
  // ──────────────────────────────────────
  {
    id: '3rd', round: 'Third-Place Play-off', date: '2026-07-19', kickoff: '02:30',
    teamA: 'France', teamB: 'England', flagA: '🇫🇷', flagB: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    venue: 'Hard Rock Stadium', city: 'Miami, FL', capacity: 64767,
    status: 'upcoming',
  },

  // ──────────────────────────────────────
  // FINAL
  // ──────────────────────────────────────
  {
    id: 'final', round: 'Final', date: '2026-07-20', kickoff: '00:30',
    teamA: 'Spain', teamB: 'Argentina', flagA: '🇪🇸', flagB: '🇦🇷',
    venue: 'MetLife Stadium', city: 'East Rutherford, NJ', capacity: 82500,
    status: 'upcoming',
  },
];

/* ── Helper: auto-compute match status from system clock ── */

function computeStatus(match: ScheduledMatch, now: Date): ScheduledMatch['status'] {
  const today = now.toISOString().split('T')[0];
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTotalMinutes = currentHour * 60 + currentMinute;

  const kickoffHour = parseInt(match.kickoff.split(':')[0], 10);
  const kickoffMinute = parseInt(match.kickoff.split(':')[1], 10);
  const kickoffTotalMinutes = kickoffHour * 60 + kickoffMinute;

  if (match.date < today) return 'completed';
  if (match.date > today) return 'upcoming';

  // Match is today
  if (currentTotalMinutes >= kickoffTotalMinutes && currentTotalMinutes < kickoffTotalMinutes + 120) {
    return 'live';
  }
  if (currentTotalMinutes >= kickoffTotalMinutes + 120) {
    return 'completed';
  }
  return 'today';
}

/* ── Build bracket data ── */

function buildBracket(): BracketData {
  return {
    quarterFinals: SCHEDULE.filter(m => m.round === 'Quarter-Final'),
    semiFinals: SCHEDULE.filter(m => m.round === 'Semi-Final'),
    thirdPlace: SCHEDULE.find(m => m.round === 'Third-Place Play-off') || null,
    final: SCHEDULE.find(m => m.round === 'Final') || null,
  };
}

/**
 * Get tournament context based on current real date/time.
 * Automatically determines match statuses, current phase, and stadium mode.
 */
export function getTournamentContext(): TournamentContext {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const currentHour = now.getHours();

  // Auto-compute statuses based on current time
  const scheduledWithStatus = SCHEDULE.map(match => ({
    ...match,
    status: match.scoreA !== undefined ? match.status : computeStatus(match, now),
  }));

  // Default to MetLife (final venue) for the dashboard
  const activeVenue = VENUES.metlife;

  // Today's matches (all venues)
  const todayMatches = scheduledWithStatus.filter(m => m.date === today);

  // Completed & upcoming
  const completedMatches = scheduledWithStatus.filter(m => m.status === 'completed');
  const upcomingMatches = scheduledWithStatus.filter(m => m.status === 'upcoming' || m.status === 'today');

  // Find current live match or today's match
  let currentMatch: ScheduledMatch | null = null;
  let nextMatch: ScheduledMatch | null = null;

  // Check for live matches
  for (const match of todayMatches) {
    if (computeStatus(match, now) === 'live') {
      currentMatch = { ...match, status: 'live' };
      break;
    }
  }

  // If no live match, look for today's upcoming match
  if (!currentMatch) {
    const todayUpcoming = todayMatches.find(m => computeStatus(m, now) === 'today');
    if (todayUpcoming) {
      currentMatch = { ...todayUpcoming, status: 'today' };
    }
  }

  // Find next upcoming match (first match with date >= today that hasn't been played)
  const futureMatches = scheduledWithStatus.filter(m =>
    (m.status === 'upcoming' || m.status === 'today') && m.date >= today
  ).sort((a, b) => a.date.localeCompare(b.date) || a.kickoff.localeCompare(b.kickoff));

  if (futureMatches.length > 0) {
    nextMatch = futureMatches[0];
  }

  // Hours until next match
  let hoursUntilNextMatch = 0;
  const relevantMatch = currentMatch?.status === 'today' ? currentMatch : nextMatch;
  if (relevantMatch) {
    const matchDate = new Date(`${relevantMatch.date}T${relevantMatch.kickoff}:00`);
    hoursUntilNextMatch = Math.max(0, Math.round((matchDate.getTime() - now.getTime()) / (1000 * 60 * 60) * 10) / 10);
  }

  // Determine stadium mode
  let stadiumMode: TournamentContext['stadiumMode'] = 'idle';
  if (currentMatch?.status === 'live') {
    stadiumMode = 'live';
  } else if (currentMatch?.status === 'today') {
    const kickoffHour = parseInt(currentMatch.kickoff.split(':')[0], 10);
    if (currentHour >= kickoffHour - 4) {
      stadiumMode = 'matchday';
    } else {
      stadiumMode = 'pre-match';
    }
  } else if (todayMatches.some(m => computeStatus(m, now) === 'completed')) {
    stadiumMode = 'post-match';
  }

  // Determine current phase from date
  let currentPhase = 'Group Stage';
  if (today >= '2026-07-19') currentPhase = 'Final';
  else if (today >= '2026-07-18') currentPhase = 'Third-Place Play-off';
  else if (today >= '2026-07-14') currentPhase = 'Semi-Finals';
  else if (today >= '2026-07-09') currentPhase = 'Quarter-Finals';
  else if (today >= '2026-07-04') currentPhase = 'Round of 16';
  else if (today >= '2026-06-28') currentPhase = 'Round of 32';
  else if (today >= '2026-06-11') currentPhase = 'Group Stage';

  // If we're between phases (rest day), show the upcoming phase
  if (todayMatches.length === 0 && nextMatch) {
    const nextDate = nextMatch.date;
    if (nextDate >= '2026-07-19') currentPhase = 'Final';
    else if (nextDate >= '2026-07-18') currentPhase = 'Third-Place Play-off';
    else if (nextDate >= '2026-07-14') currentPhase = 'Semi-Finals';
  }

  // Tournament day calculation (June 11 = Day 1)
  const tournamentStart = new Date('2026-06-11');
  const tournamentDay = Math.floor((now.getTime() - tournamentStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  return {
    currentPhase,
    currentMatch,
    nextMatch,
    todayMatches,
    upcomingMatches,
    completedMatches,
    venue: activeVenue,
    stadiumMode,
    hoursUntilNextMatch,
    tournamentDay: Math.max(1, tournamentDay),
    matchesPlayed: completedMatches.length,
    matchesRemaining: upcomingMatches.length,
    bracket: buildBracket(),
  };
}

/**
 * Get all matches grouped by round for display.
 */
export function getMatchesByRound(): Record<string, ScheduledMatch[]> {
  const groups: Record<string, ScheduledMatch[]> = {};
  for (const match of SCHEDULE) {
    if (!groups[match.round]) groups[match.round] = [];
    groups[match.round].push(match);
  }
  return groups;
}

/**
 * Get a specific match by ID.
 */
export function getMatchById(id: string): ScheduledMatch | undefined {
  return SCHEDULE.find(m => m.id === id);
}

export { SCHEDULE, VENUES };
