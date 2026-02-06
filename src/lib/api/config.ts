// API Configuration for Semnox Parafait
// Uses environment variables for deployment flexibility

export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_SEMNOX_BASE_URL || 'http://localhost:3000/api',
  apiKey: process.env.SEMNOX_API_KEY || '',
  
  // Endpoints - will be used when connecting to real Semnox APIs
  endpoints: {
    cards: '/cards',
    cardDetails: (cardId: string) => `/cards/${cardId}`,
    transactions: '/transactions',
    redemptions: '/redemptions',
    games: '/games',
    alerts: '/alerts',
  },
  
  // Thresholds from env or defaults
  thresholds: {
    ticketsPerMinuteWarning: Number(process.env.NEXT_PUBLIC_TICKETS_PER_MIN_WARNING) || 50,
    ticketsPerMinuteCritical: Number(process.env.NEXT_PUBLIC_TICKETS_PER_MIN_CRITICAL) || 100,
    highBalanceWarning: Number(process.env.NEXT_PUBLIC_HIGH_BALANCE_WARNING) || 5000,
    highBalanceCritical: Number(process.env.NEXT_PUBLIC_HIGH_BALANCE_CRITICAL) || 15000,
  },
  
  // Feature flags
  features: {
    enableRealTime: process.env.NEXT_PUBLIC_ENABLE_REAL_TIME === 'true',
    refreshInterval: Number(process.env.NEXT_PUBLIC_REFRESH_INTERVAL_MS) || 30000,
  },
};

// Headers for API requests
export function getAuthHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_CONFIG.apiKey}`,
  };
}

