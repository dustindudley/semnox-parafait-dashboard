// Semnox API Client
// This module provides functions to fetch data from Semnox REST APIs
// Currently uses mock data, but structured for easy API integration

import { API_CONFIG, getAuthHeaders } from './config';
import {
  mockCardHolders,
  mockVelocityData,
  mockVelocityScatterData,
  mockRedemptions,
  mockDashboardStats,
  type CardHolder,
  type VelocityData,
  type RedemptionEvent,
  type DashboardStats,
} from '../mockData';

// Toggle between mock and real API
const USE_MOCK_DATA = true;

/**
 * Fetch high-earner card holders
 * In production: GET /api/cards?sort=ticketBalance&order=desc&limit=10
 */
export async function fetchHighEarners(limit: number = 10): Promise<CardHolder[]> {
  if (USE_MOCK_DATA) {
    return mockCardHolders
      .sort((a, b) => b.ticketBalance - a.ticketBalance)
      .slice(0, limit);
  }

  const response = await fetch(
    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.cards}?sort=ticketBalance&order=desc&limit=${limit}`,
    { headers: getAuthHeaders() }
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch high earners: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetch velocity monitoring data
 * In production: GET /api/transactions/velocity?timeWindow=5
 */
export async function fetchVelocityData(): Promise<VelocityData[]> {
  if (USE_MOCK_DATA) {
    return mockVelocityData;
  }

  const response = await fetch(
    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.transactions}/velocity?timeWindow=${API_CONFIG.thresholds.ticketsPerMinuteWarning}`,
    { headers: getAuthHeaders() }
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch velocity data: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetch scatter plot data for velocity visualization
 */
export async function fetchVelocityScatterData(): Promise<VelocityData[]> {
  if (USE_MOCK_DATA) {
    return mockVelocityScatterData;
  }

  const response = await fetch(
    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.transactions}/velocity/scatter`,
    { headers: getAuthHeaders() }
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch velocity scatter data: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetch recent redemptions
 * In production: GET /api/redemptions?limit=20&sort=timestamp&order=desc
 */
export async function fetchRecentRedemptions(limit: number = 20): Promise<RedemptionEvent[]> {
  if (USE_MOCK_DATA) {
    return mockRedemptions.slice(0, limit);
  }

  const response = await fetch(
    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.redemptions}?limit=${limit}&sort=timestamp&order=desc`,
    { headers: getAuthHeaders() }
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch redemptions: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetch dashboard summary statistics
 * In production: GET /api/dashboard/stats
 */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  if (USE_MOCK_DATA) {
    return mockDashboardStats;
  }

  const response = await fetch(
    `${API_CONFIG.baseUrl}/dashboard/stats`,
    { headers: getAuthHeaders() }
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard stats: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetch alerts for suspicious activity
 * In production: GET /api/alerts?status=active
 */
export async function fetchActiveAlerts(): Promise<CardHolder[]> {
  if (USE_MOCK_DATA) {
    return mockCardHolders.filter(card => card.status !== 'normal');
  }

  const response = await fetch(
    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.alerts}?status=active`,
    { headers: getAuthHeaders() }
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch alerts: ${response.statusText}`);
  }
  
  return response.json();
}

