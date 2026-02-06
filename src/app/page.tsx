'use client';

import { useEffect, useState } from 'react';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { HighEarnerLeaderboard } from '@/components/dashboard/HighEarnerLeaderboard';
import { VelocityMonitor } from '@/components/dashboard/VelocityMonitor';
import { RedemptionFeed } from '@/components/dashboard/RedemptionFeed';
import { Card, CardContent } from '@/components/ui/card';
import { Database, Upload, Calendar, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import {
  hasImportedData,
  getDataStoreStats,
  loadRedemptions,
  loadGameMetrics,
  getCardSummaries,
  getGameSummaries,
} from '@/lib/csv/store';
import type { DashboardStats, CardHolder, VelocityData, RedemptionEvent } from '@/lib/mockData';

export default function OverviewPage() {
  const [hasData, setHasData] = useState<boolean | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [cardHolders, setCardHolders] = useState<CardHolder[]>([]);
  const [velocityData, setVelocityData] = useState<VelocityData[]>([]);
  const [redemptions, setRedemptions] = useState<RedemptionEvent[]>([]);

  useEffect(() => {
    const dataExists = hasImportedData();
    setHasData(dataExists);

    if (dataExists) {
      const storeStats = getDataStoreStats();
      const cardSummaries = getCardSummaries();
      const gameSummaries = getGameSummaries();
      const redemptionData = loadRedemptions();

      // Build stats from imported data
      setStats({
        totalActiveCards: cardSummaries.length,
        totalTicketsCirculation: gameSummaries.reduce((sum, g) => sum + g.totalTickets, 0),
        alertsCount: gameSummaries.filter(g => g.avgTicketsPerPlay > 50).length,
        redemptionsToday: redemptionData.length,
        avgTicketsPerHour: gameSummaries.length > 0 
          ? Math.round(gameSummaries.reduce((sum, g) => sum + g.totalTickets, 0) / 24) 
          : 0,
        suspiciousActivities: gameSummaries.filter(g => g.avgTicketsPerPlay > 100).length,
      });

      // Convert card summaries to CardHolder format for leaderboard
      setCardHolders(cardSummaries.slice(0, 10).map((card, index) => ({
        cardId: `CARD-${String(index + 1).padStart(3, '0')}`,
        cardNumber: card.cardNumber,
        customerName: `Card ${card.cardNumber.slice(-4)}`,
        ticketBalance: card.totalTicketsRedeemed,
        recentEarnings: Math.round(card.totalTicketsRedeemed / card.totalTransactions),
        lastActivity: card.lastRedemption.toISOString(),
        status: card.totalTicketsRedeemed > 5000 ? 'critical' : card.totalTicketsRedeemed > 2000 ? 'warning' : 'normal',
        ticketsPerMinute: 0, // Not available from redemption data
        totalPlayTime: card.totalTransactions * 10,
      })));

      // Build velocity data from game summaries (using tickets per play as proxy)
      setVelocityData(gameSummaries.slice(0, 20).map((game, index) => ({
        cardId: `G-${String(index + 1).padStart(3, '0')}`,
        ticketsEarned: game.totalTickets,
        timeElapsed: 5,
        ticketsPerMinute: Math.round(game.avgTicketsPerPlay * 10), // Scale for visualization
        gameName: game.gameName,
        timestamp: new Date().toISOString(),
        status: game.avgTicketsPerPlay > 100 ? 'critical' : game.avgTicketsPerPlay > 50 ? 'warning' : 'normal',
      })));

      // Convert redemption data to RedemptionEvent format
      setRedemptions(redemptionData.slice(0, 10).map((r, index) => ({
        id: r.redemptionId || `RED-${index}`,
        cardId: r.cardNumber || 'Unknown',
        cardNumber: r.cardNumber || 'N/A',
        customerName: `Card ${r.cardNumber?.slice(-4) || 'Unknown'}`,
        prizeName: r.giftCode ? `Prize (${r.giftCode.slice(-6)})` : 'Ticket Redemption',
        ticketValue: r.totalTicketsRedeemed || r.eTicketsRedeemed || r.giftTickets || 0,
        timestamp: r.redeemedDate.toISOString(),
        location: r.posName || 'Unknown',
      })));
    }
  }, []);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Loading state
  if (hasData === null) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // No data - prompt for upload
  if (!hasData) {
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
        </div>

        {/* No Data Prompt */}
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-12 text-center">
            <Database className="h-20 w-20 text-primary mx-auto mb-6 opacity-80" />
            <h2 className="text-2xl font-semibold mb-3">Welcome to Semnox Analytics</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Import CSV reports from your Semnox Parafait system to start monitoring 
              ticket earnings, detect anomalies, and track redemptions.
            </p>
            <Link
              href="/data-import"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-lg transition-all hover:scale-105"
            >
              <Upload className="h-6 w-6" />
              Import CSV Data
            </Link>
            <p className="text-sm text-muted-foreground mt-6">
              Supported: Game Metric Report, Redemption Tickets Details, Master Audit Report
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Has data - show dashboard
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
          <Link 
            href="/data-import"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
          >
            <Upload className="h-4 w-4" />
            Import More Data
          </Link>
          <div className="text-xs text-muted-foreground px-3 py-2 rounded-lg bg-muted/50">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <section>
          <StatsCards stats={stats} />
        </section>
      )}

      {/* Main Dashboard Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Leaderboard - Takes 2 columns */}
        <div className="lg:col-span-2">
          {cardHolders.length > 0 ? (
            <HighEarnerLeaderboard cardHolders={cardHolders} />
          ) : (
            <Card className="p-8 text-center text-muted-foreground">
              <p>No card data available. Import a Redemption Tickets Details Report.</p>
            </Card>
          )}
        </div>

        {/* Redemption Feed - Takes 1 column */}
        <div className="lg:col-span-1">
          {redemptions.length > 0 ? (
            <RedemptionFeed redemptions={redemptions} />
          ) : (
            <Card className="p-8 text-center text-muted-foreground">
              <p>No redemption data available.</p>
            </Card>
          )}
        </div>
      </div>

      {/* Velocity Monitor - Full width */}
      {velocityData.length > 0 && (
        <section>
          <VelocityMonitor velocityData={velocityData} />
        </section>
      )}

      {/* Footer */}
      <footer className="pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Semnox Parafait Analytics Dashboard • Data from imported CSV reports
        </p>
      </footer>
    </div>
  );
}
