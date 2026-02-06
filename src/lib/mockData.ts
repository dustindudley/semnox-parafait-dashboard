// Mock data for Semnox Parafait Analytics Dashboard
// This data simulates the structure expected from Semnox REST APIs

export interface CardHolder {
  cardId: string;
  cardNumber: string;
  customerName: string;
  ticketBalance: number;
  recentEarnings: number;
  lastActivity: string;
  status: 'normal' | 'warning' | 'critical';
  ticketsPerMinute: number;
  totalPlayTime: number; // in minutes
}

export interface VelocityData {
  cardId: string;
  ticketsEarned: number;
  timeElapsed: number; // in minutes
  ticketsPerMinute: number;
  gameName: string;
  timestamp: string;
  status: 'normal' | 'warning' | 'critical';
}

export interface RedemptionEvent {
  id: string;
  cardId: string;
  cardNumber: string;
  customerName: string;
  prizeName: string;
  ticketValue: number;
  timestamp: string;
  location: string;
}

export interface DashboardStats {
  totalActiveCards: number;
  totalTicketsCirculation: number;
  alertsCount: number;
  redemptionsToday: number;
  avgTicketsPerHour: number;
  suspiciousActivities: number;
}

// Threshold configurations (can be environment variables in production)
export const THRESHOLDS = {
  TICKETS_PER_MINUTE_WARNING: 50,
  TICKETS_PER_MINUTE_CRITICAL: 100,
  HIGH_BALANCE_WARNING: 5000,
  HIGH_BALANCE_CRITICAL: 15000,
  TIME_WINDOW_MINUTES: 5,
};

// Generate realistic card holders with varying activity levels
export const mockCardHolders: CardHolder[] = [
  {
    cardId: 'CARD-001',
    cardNumber: '4521-8834-2231',
    customerName: 'Alex Thompson',
    ticketBalance: 23450,
    recentEarnings: 8500,
    lastActivity: '2026-02-06T15:42:00',
    status: 'critical',
    ticketsPerMinute: 142,
    totalPlayTime: 45,
  },
  {
    cardId: 'CARD-002',
    cardNumber: '4521-9912-5567',
    customerName: 'Maria Garcia',
    ticketBalance: 12800,
    recentEarnings: 2400,
    lastActivity: '2026-02-06T15:38:00',
    status: 'warning',
    ticketsPerMinute: 68,
    totalPlayTime: 120,
  },
  {
    cardId: 'CARD-003',
    cardNumber: '4521-7745-8890',
    customerName: 'James Wilson',
    ticketBalance: 8900,
    recentEarnings: 1200,
    lastActivity: '2026-02-06T15:35:00',
    status: 'normal',
    ticketsPerMinute: 32,
    totalPlayTime: 85,
  },
  {
    cardId: 'CARD-004',
    cardNumber: '4521-3321-1156',
    customerName: 'Sarah Chen',
    ticketBalance: 18200,
    recentEarnings: 5600,
    lastActivity: '2026-02-06T15:40:00',
    status: 'critical',
    ticketsPerMinute: 112,
    totalPlayTime: 35,
  },
  {
    cardId: 'CARD-005',
    cardNumber: '4521-6678-4423',
    customerName: 'Michael Brown',
    ticketBalance: 6500,
    recentEarnings: 890,
    lastActivity: '2026-02-06T15:30:00',
    status: 'normal',
    ticketsPerMinute: 28,
    totalPlayTime: 150,
  },
  {
    cardId: 'CARD-006',
    cardNumber: '4521-2245-7789',
    customerName: 'Emily Davis',
    ticketBalance: 4200,
    recentEarnings: 650,
    lastActivity: '2026-02-06T15:25:00',
    status: 'normal',
    ticketsPerMinute: 18,
    totalPlayTime: 95,
  },
  {
    cardId: 'CARD-007',
    cardNumber: '4521-8890-3312',
    customerName: 'David Kim',
    ticketBalance: 15600,
    recentEarnings: 4200,
    lastActivity: '2026-02-06T15:41:00',
    status: 'warning',
    ticketsPerMinute: 75,
    totalPlayTime: 60,
  },
  {
    cardId: 'CARD-008',
    cardNumber: '4521-4456-9901',
    customerName: 'Jessica Martinez',
    ticketBalance: 3100,
    recentEarnings: 420,
    lastActivity: '2026-02-06T15:20:00',
    status: 'normal',
    ticketsPerMinute: 12,
    totalPlayTime: 180,
  },
  {
    cardId: 'CARD-009',
    cardNumber: '4521-1123-6654',
    customerName: 'Robert Anderson',
    ticketBalance: 9800,
    recentEarnings: 2800,
    lastActivity: '2026-02-06T15:39:00',
    status: 'warning',
    ticketsPerMinute: 56,
    totalPlayTime: 75,
  },
  {
    cardId: 'CARD-010',
    cardNumber: '4521-5567-2238',
    customerName: 'Lisa Taylor',
    ticketBalance: 2400,
    recentEarnings: 380,
    lastActivity: '2026-02-06T15:15:00',
    status: 'normal',
    ticketsPerMinute: 15,
    totalPlayTime: 200,
  },
];

// Velocity monitoring data - shows ticket acquisition rates
export const mockVelocityData: VelocityData[] = [
  { cardId: 'CARD-001', ticketsEarned: 710, timeElapsed: 5, ticketsPerMinute: 142, gameName: 'Jackpot Spinner', timestamp: '2026-02-06T15:42:00', status: 'critical' },
  { cardId: 'CARD-004', ticketsEarned: 560, timeElapsed: 5, ticketsPerMinute: 112, gameName: 'Mega Claw', timestamp: '2026-02-06T15:40:00', status: 'critical' },
  { cardId: 'CARD-007', ticketsEarned: 375, timeElapsed: 5, ticketsPerMinute: 75, gameName: 'Speed Racer', timestamp: '2026-02-06T15:41:00', status: 'warning' },
  { cardId: 'CARD-002', ticketsEarned: 340, timeElapsed: 5, ticketsPerMinute: 68, gameName: 'Ticket Tornado', timestamp: '2026-02-06T15:38:00', status: 'warning' },
  { cardId: 'CARD-009', ticketsEarned: 280, timeElapsed: 5, ticketsPerMinute: 56, gameName: 'Lucky Wheel', timestamp: '2026-02-06T15:39:00', status: 'warning' },
  { cardId: 'CARD-003', ticketsEarned: 160, timeElapsed: 5, ticketsPerMinute: 32, gameName: 'Arcade Classics', timestamp: '2026-02-06T15:35:00', status: 'normal' },
  { cardId: 'CARD-005', ticketsEarned: 140, timeElapsed: 5, ticketsPerMinute: 28, gameName: 'Skee-Ball Pro', timestamp: '2026-02-06T15:30:00', status: 'normal' },
  { cardId: 'CARD-006', ticketsEarned: 90, timeElapsed: 5, ticketsPerMinute: 18, gameName: 'Basketball Hoops', timestamp: '2026-02-06T15:25:00', status: 'normal' },
  { cardId: 'CARD-010', ticketsEarned: 75, timeElapsed: 5, ticketsPerMinute: 15, gameName: 'Whack-a-Mole', timestamp: '2026-02-06T15:15:00', status: 'normal' },
  { cardId: 'CARD-008', ticketsEarned: 60, timeElapsed: 5, ticketsPerMinute: 12, gameName: 'Air Hockey', timestamp: '2026-02-06T15:20:00', status: 'normal' },
];

// Extended velocity data for scatter plot visualization
export const mockVelocityScatterData: VelocityData[] = [
  // Normal gameplay cluster (15-40 tpm)
  { cardId: 'P-001', ticketsEarned: 120, timeElapsed: 5, ticketsPerMinute: 24, gameName: 'Skee-Ball', timestamp: '2026-02-06T14:00:00', status: 'normal' },
  { cardId: 'P-002', ticketsEarned: 85, timeElapsed: 5, ticketsPerMinute: 17, gameName: 'Basketball', timestamp: '2026-02-06T14:05:00', status: 'normal' },
  { cardId: 'P-003', ticketsEarned: 145, timeElapsed: 5, ticketsPerMinute: 29, gameName: 'Wheel Spin', timestamp: '2026-02-06T14:10:00', status: 'normal' },
  { cardId: 'P-004', ticketsEarned: 190, timeElapsed: 5, ticketsPerMinute: 38, gameName: 'Claw Machine', timestamp: '2026-02-06T14:15:00', status: 'normal' },
  { cardId: 'P-005', ticketsEarned: 110, timeElapsed: 5, ticketsPerMinute: 22, gameName: 'Arcade Racer', timestamp: '2026-02-06T14:20:00', status: 'normal' },
  { cardId: 'P-006', ticketsEarned: 165, timeElapsed: 5, ticketsPerMinute: 33, gameName: 'Duck Hunt', timestamp: '2026-02-06T14:25:00', status: 'normal' },
  { cardId: 'P-007', ticketsEarned: 95, timeElapsed: 5, ticketsPerMinute: 19, gameName: 'Air Hockey', timestamp: '2026-02-06T14:30:00', status: 'normal' },
  { cardId: 'P-008', ticketsEarned: 130, timeElapsed: 5, ticketsPerMinute: 26, gameName: 'Pinball', timestamp: '2026-02-06T14:35:00', status: 'normal' },
  // Warning zone (50-99 tpm) - skilled players or minor anomalies
  { cardId: 'P-009', ticketsEarned: 280, timeElapsed: 5, ticketsPerMinute: 56, gameName: 'Mega Jackpot', timestamp: '2026-02-06T14:40:00', status: 'warning' },
  { cardId: 'P-010', ticketsEarned: 325, timeElapsed: 5, ticketsPerMinute: 65, gameName: 'Prize Drop', timestamp: '2026-02-06T14:45:00', status: 'warning' },
  { cardId: 'P-011', ticketsEarned: 420, timeElapsed: 5, ticketsPerMinute: 84, gameName: 'Lucky Strike', timestamp: '2026-02-06T14:50:00', status: 'warning' },
  { cardId: 'P-012', ticketsEarned: 365, timeElapsed: 5, ticketsPerMinute: 73, gameName: 'Ticket Blast', timestamp: '2026-02-06T14:55:00', status: 'warning' },
  // Critical anomalies (100+ tpm) - likely exploits
  { cardId: 'CARD-001', ticketsEarned: 710, timeElapsed: 5, ticketsPerMinute: 142, gameName: 'Jackpot Spinner', timestamp: '2026-02-06T15:00:00', status: 'critical' },
  { cardId: 'CARD-004', ticketsEarned: 560, timeElapsed: 5, ticketsPerMinute: 112, gameName: 'Mega Claw', timestamp: '2026-02-06T15:05:00', status: 'critical' },
  { cardId: 'P-013', ticketsEarned: 625, timeElapsed: 5, ticketsPerMinute: 125, gameName: 'Mystery Box', timestamp: '2026-02-06T15:10:00', status: 'critical' },
  // More normal data points for density
  { cardId: 'P-014', ticketsEarned: 175, timeElapsed: 5, ticketsPerMinute: 35, gameName: 'Pop Shot', timestamp: '2026-02-06T15:15:00', status: 'normal' },
  { cardId: 'P-015', ticketsEarned: 100, timeElapsed: 5, ticketsPerMinute: 20, gameName: 'Derby Race', timestamp: '2026-02-06T15:20:00', status: 'normal' },
  { cardId: 'P-016', ticketsEarned: 140, timeElapsed: 5, ticketsPerMinute: 28, gameName: 'Fish Bowl', timestamp: '2026-02-06T15:25:00', status: 'normal' },
  { cardId: 'P-017', ticketsEarned: 200, timeElapsed: 5, ticketsPerMinute: 40, gameName: 'Coin Push', timestamp: '2026-02-06T15:30:00', status: 'normal' },
  { cardId: 'P-018', ticketsEarned: 80, timeElapsed: 5, ticketsPerMinute: 16, gameName: 'Ring Toss', timestamp: '2026-02-06T15:35:00', status: 'normal' },
];

// Recent redemption events
export const mockRedemptions: RedemptionEvent[] = [
  {
    id: 'RED-001',
    cardId: 'CARD-003',
    cardNumber: '4521-7745-8890',
    customerName: 'James Wilson',
    prizeName: 'Giant Plush Bear',
    ticketValue: 5000,
    timestamp: '2026-02-06T15:45:00',
    location: 'Prize Counter A',
  },
  {
    id: 'RED-002',
    cardId: 'CARD-005',
    cardNumber: '4521-6678-4423',
    customerName: 'Michael Brown',
    prizeName: 'Wireless Earbuds',
    ticketValue: 3500,
    timestamp: '2026-02-06T15:42:00',
    location: 'Prize Counter B',
  },
  {
    id: 'RED-003',
    cardId: 'CARD-001',
    cardNumber: '4521-8834-2231',
    customerName: 'Alex Thompson',
    prizeName: 'Nintendo Switch',
    ticketValue: 15000,
    timestamp: '2026-02-06T15:38:00',
    location: 'Prize Counter A',
  },
  {
    id: 'RED-004',
    cardId: 'CARD-008',
    cardNumber: '4521-4456-9901',
    customerName: 'Jessica Martinez',
    prizeName: 'Candy Pack (Large)',
    ticketValue: 250,
    timestamp: '2026-02-06T15:35:00',
    location: 'Prize Counter C',
  },
  {
    id: 'RED-005',
    cardId: 'CARD-006',
    cardNumber: '4521-2245-7789',
    customerName: 'Emily Davis',
    prizeName: 'Bluetooth Speaker',
    ticketValue: 2800,
    timestamp: '2026-02-06T15:30:00',
    location: 'Prize Counter B',
  },
  {
    id: 'RED-006',
    cardId: 'CARD-010',
    cardNumber: '4521-5567-2238',
    customerName: 'Lisa Taylor',
    prizeName: 'Keychain Collection',
    ticketValue: 150,
    timestamp: '2026-02-06T15:25:00',
    location: 'Prize Counter C',
  },
  {
    id: 'RED-007',
    cardId: 'CARD-002',
    cardNumber: '4521-9912-5567',
    customerName: 'Maria Garcia',
    prizeName: 'RC Car Deluxe',
    ticketValue: 4500,
    timestamp: '2026-02-06T15:20:00',
    location: 'Prize Counter A',
  },
  {
    id: 'RED-008',
    cardId: 'CARD-007',
    cardNumber: '4521-8890-3312',
    customerName: 'David Kim',
    prizeName: 'LED Gaming Mouse',
    ticketValue: 3200,
    timestamp: '2026-02-06T15:15:00',
    location: 'Prize Counter B',
  },
];

// Dashboard summary statistics
export const mockDashboardStats: DashboardStats = {
  totalActiveCards: 847,
  totalTicketsCirculation: 2456780,
  alertsCount: 5,
  redemptionsToday: 156,
  avgTicketsPerHour: 1250,
  suspiciousActivities: 3,
};

// Utility function to format timestamps
export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Utility function to get relative time
export function getRelativeTime(timestamp: string): string {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  return date.toLocaleDateString();
}

// Utility to determine status based on thresholds
export function getVelocityStatus(ticketsPerMinute: number): 'normal' | 'warning' | 'critical' {
  if (ticketsPerMinute >= THRESHOLDS.TICKETS_PER_MINUTE_CRITICAL) return 'critical';
  if (ticketsPerMinute >= THRESHOLDS.TICKETS_PER_MINUTE_WARNING) return 'warning';
  return 'normal';
}

export function getBalanceStatus(balance: number): 'normal' | 'warning' | 'critical' {
  if (balance >= THRESHOLDS.HIGH_BALANCE_CRITICAL) return 'critical';
  if (balance >= THRESHOLDS.HIGH_BALANCE_WARNING) return 'warning';
  return 'normal';
}

