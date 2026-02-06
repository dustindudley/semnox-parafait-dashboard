'use client';

import { StatsCards } from '@/components/dashboard/StatsCards';
import { HighEarnerLeaderboard } from '@/components/dashboard/HighEarnerLeaderboard';
import { VelocityMonitor } from '@/components/dashboard/VelocityMonitor';
import { RedemptionFeed } from '@/components/dashboard/RedemptionFeed';
import {
  mockCardHolders,
  mockVelocityScatterData,
  mockRedemptions,
  mockDashboardStats,
} from '@/lib/mockData';
import { RefreshCw, Calendar } from 'lucide-react';

export default function OverviewPage() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {currentDate}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm font-medium transition-colors">
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </button>
          <div className="text-xs text-muted-foreground px-3 py-2 rounded-lg bg-muted/50">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <section>
        <StatsCards stats={mockDashboardStats} />
      </section>

      {/* Main Dashboard Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Leaderboard - Takes 2 columns */}
        <div className="lg:col-span-2">
          <HighEarnerLeaderboard cardHolders={mockCardHolders} />
        </div>

        {/* Redemption Feed - Takes 1 column */}
        <div className="lg:col-span-1">
          <RedemptionFeed redemptions={mockRedemptions} />
        </div>
      </div>

      {/* Velocity Monitor - Full width */}
      <section>
        <VelocityMonitor velocityData={mockVelocityScatterData} />
      </section>

      {/* Footer */}
      <footer className="pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Semnox Parafait Analytics Dashboard • Data refreshes every 30 seconds in production mode
        </p>
      </footer>
    </div>
  );
}
