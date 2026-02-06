// Simple client-side data store for imported CSV data
// Uses localStorage for persistence across page reloads

import type {
  GameMetric,
  RedemptionDetail,
  AuditRecord,
  CardRedemptionSummary,
  GamePerformanceSummary,
} from './parsers';

import {
  aggregateRedemptionsByCard,
  aggregateGamePerformance,
} from './parsers';

const STORAGE_KEYS = {
  GAME_METRICS: 'semnox_game_metrics',
  REDEMPTIONS: 'semnox_redemptions',
  AUDIT_RECORDS: 'semnox_audit_records',
  LAST_IMPORT: 'semnox_last_import',
};

export interface ImportedData {
  gameMetrics: GameMetric[];
  redemptions: RedemptionDetail[];
  auditRecords: AuditRecord[];
  lastImport: Date | null;
}

export interface DataStoreStats {
  gameMetricsCount: number;
  redemptionsCount: number;
  auditRecordsCount: number;
  lastImport: Date | null;
}

// Save data to localStorage
export function saveGameMetrics(data: GameMetric[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.GAME_METRICS, JSON.stringify(data));
  updateLastImport();
}

export function saveRedemptions(data: RedemptionDetail[]): void {
  if (typeof window === 'undefined') return;
  // Convert Date objects to ISO strings for storage
  const serialized = data.map(d => ({
    ...d,
    redeemedDate: d.redeemedDate.toISOString(),
  }));
  localStorage.setItem(STORAGE_KEYS.REDEMPTIONS, JSON.stringify(serialized));
  updateLastImport();
}

export function saveAuditRecords(data: AuditRecord[]): void {
  if (typeof window === 'undefined') return;
  const serialized = data.map(d => ({
    ...d,
    dateOfLog: d.dateOfLog.toISOString(),
  }));
  localStorage.setItem(STORAGE_KEYS.AUDIT_RECORDS, JSON.stringify(serialized));
  updateLastImport();
}

function updateLastImport(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.LAST_IMPORT, new Date().toISOString());
}

// Load data from localStorage
export function loadGameMetrics(): GameMetric[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEYS.GAME_METRICS);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function loadRedemptions(): RedemptionDetail[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEYS.REDEMPTIONS);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    // Convert ISO strings back to Date objects
    return parsed.map((d: any) => ({
      ...d,
      redeemedDate: new Date(d.redeemedDate),
    }));
  } catch {
    return [];
  }
}

export function loadAuditRecords(): AuditRecord[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEYS.AUDIT_RECORDS);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    return parsed.map((d: any) => ({
      ...d,
      dateOfLog: new Date(d.dateOfLog),
    }));
  } catch {
    return [];
  }
}

export function getLastImport(): Date | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(STORAGE_KEYS.LAST_IMPORT);
  if (!stored) return null;
  return new Date(stored);
}

// Load all data
export function loadAllData(): ImportedData {
  return {
    gameMetrics: loadGameMetrics(),
    redemptions: loadRedemptions(),
    auditRecords: loadAuditRecords(),
    lastImport: getLastImport(),
  };
}

// Get storage stats
export function getDataStoreStats(): DataStoreStats {
  return {
    gameMetricsCount: loadGameMetrics().length,
    redemptionsCount: loadRedemptions().length,
    auditRecordsCount: loadAuditRecords().length,
    lastImport: getLastImport(),
  };
}

// Clear all stored data
export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.GAME_METRICS);
  localStorage.removeItem(STORAGE_KEYS.REDEMPTIONS);
  localStorage.removeItem(STORAGE_KEYS.AUDIT_RECORDS);
  localStorage.removeItem(STORAGE_KEYS.LAST_IMPORT);
}

// Get aggregated summaries for dashboard
export function getCardSummaries(): CardRedemptionSummary[] {
  const redemptions = loadRedemptions();
  return aggregateRedemptionsByCard(redemptions);
}

export function getGameSummaries(): GamePerformanceSummary[] {
  const games = loadGameMetrics();
  return aggregateGamePerformance(games);
}

// Check if data has been imported
export function hasImportedData(): boolean {
  const stats = getDataStoreStats();
  return stats.gameMetricsCount > 0 || stats.redemptionsCount > 0 || stats.auditRecordsCount > 0;
}

