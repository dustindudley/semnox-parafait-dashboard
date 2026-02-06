'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  Gamepad2,
  CreditCard,
  Ticket,
  AlertTriangle,
  Database,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  loadGameMetrics,
  loadRedemptions,
  hasImportedData,
  getCardSummaries,
  getGameSummaries,
} from '@/lib/csv/store';
import type { GamePerformanceSummary, CardRedemptionSummary } from '@/lib/csv/parsers';
import Link from 'next/link';

const CHART_COLORS = [
  'hsl(174, 70%, 45%)',
  'hsl(142, 71%, 45%)',
  'hsl(38, 92%, 50%)',
  'hsl(0, 72%, 51%)',
  'hsl(262, 83%, 58%)',
  'hsl(200, 70%, 50%)',
  'hsl(320, 70%, 50%)',
  'hsl(50, 90%, 50%)',
];

export default function AnalyticsPage() {
  const [hasData, setHasData] = useState(false);
  const [gameSummaries, setGameSummaries] = useState<GamePerformanceSummary[]>([]);
  const [cardSummaries, setCardSummaries] = useState<CardRedemptionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setHasData(hasImportedData());
    setGameSummaries(getGameSummaries());
    setCardSummaries(getCardSummaries());
    setIsLoading(false);
  }, []);

  // Calculate totals
  const totalTicketsDispensed = gameSummaries.reduce((sum, g) => sum + g.totalTickets, 0);
  const totalPlays = gameSummaries.reduce((sum, g) => sum + g.totalPlays, 0);
  const totalRevenue = gameSummaries.reduce((sum, g) => sum + g.totalRevenue, 0);
  const avgPayoutPercent = gameSummaries.length > 0
    ? gameSummaries.reduce((sum, g) => sum + g.payoutPercent, 0) / gameSummaries.length
    : 0;

  // Prepare chart data - top 10 games by tickets
  const topGamesByTickets = gameSummaries.slice(0, 10).map(g => ({
    name: g.gameName.length > 15 ? g.gameName.substring(0, 15) + '...' : g.gameName,
    tickets: g.totalTickets,
    plays: g.totalPlays,
  }));

  // Prepare pie chart data - tickets by game profile
  const ticketsByProfile = gameSummaries.reduce((acc, g) => {
    const profile = g.gameProfile || 'Other';
    acc[profile] = (acc[profile] || 0) + g.totalTickets;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(ticketsByProfile)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-muted-foreground">Loading analytics...</div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="p-8 space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-primary" />
              Analytics
            </h1>
            <p className="text-muted-foreground">
              Insights from your Semnox data
            </p>
          </div>
        </div>

        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="p-12 text-center">
            <Database className="h-16 w-16 text-warning mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Data Imported</h2>
            <p className="text-muted-foreground mb-6">
              Import CSV reports from Semnox to see analytics and insights.
            </p>
            <Link
              href="/data-import"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors"
            >
              <Database className="h-5 w-5" />
              Go to Data Import
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-primary" />
            Analytics
          </h1>
          <p className="text-muted-foreground">
            Insights from your imported Semnox data
          </p>
        </div>
        <Badge variant="outline" className="gap-2">
          <Database className="h-4 w-4" />
          {gameSummaries.length} Games • {cardSummaries.length} Cards
        </Badge>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Gamepad2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Plays</p>
                <p className="text-2xl font-bold tabular-nums">
                  {totalPlays.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                <Ticket className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tickets Dispensed</p>
                <p className="text-2xl font-bold tabular-nums">
                  {totalTicketsDispensed.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
                <CreditCard className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold tabular-nums">
                  ${totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Payout %</p>
                <p className="text-2xl font-bold tabular-nums">
                  {avgPayoutPercent.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Games by Tickets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5 text-primary" />
              Top Games by Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topGamesByTickets}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(235, 15%, 28%)" />
                  <XAxis
                    type="number"
                    tick={{ fill: 'hsl(235, 10%, 65%)', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(235, 15%, 28%)' }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: 'hsl(235, 10%, 65%)', fontSize: 11 }}
                    axisLine={{ stroke: 'hsl(235, 15%, 28%)' }}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(235, 15%, 18%)',
                      border: '1px solid hsl(235, 15%, 28%)',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: 'hsl(235, 10%, 95%)' }}
                  />
                  <Bar dataKey="tickets" fill="hsl(174, 70%, 45%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tickets by Game Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gamepad2 className="h-5 w-5 text-primary" />
              Tickets by Game Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={{ stroke: 'hsl(235, 10%, 65%)' }}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(235, 15%, 18%)',
                      border: '1px solid hsl(235, 15%, 28%)',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [value.toLocaleString() + ' tickets', 'Tickets']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Redemption Cards */}
      {cardSummaries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Top Cards by Redemption Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>Rank</TableHead>
                    <TableHead>Card Number</TableHead>
                    <TableHead className="text-right">Tickets Redeemed</TableHead>
                    <TableHead className="text-right">Transactions</TableHead>
                    <TableHead>Last Redemption</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cardSummaries.slice(0, 10).map((card, index) => (
                    <TableRow key={card.cardNumber}>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            'font-bold',
                            index === 0 && 'bg-yellow-500/20 text-yellow-500',
                            index === 1 && 'bg-gray-400/20 text-gray-400',
                            index === 2 && 'bg-amber-600/20 text-amber-600'
                          )}
                        >
                          #{index + 1}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {card.cardNumber}
                      </TableCell>
                      <TableCell className="text-right font-semibold tabular-nums">
                        {card.totalTicketsRedeemed.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {card.totalTransactions}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {card.lastRedemption.toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* High Ticket Games Warning */}
      {gameSummaries.filter(g => g.avgTicketsPerPlay > 50).length > 0 && (
        <Card className="border-warning/30 bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
              High Payout Games
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              These games have unusually high ticket-per-play averages. Consider investigating for potential exploits.
            </p>
            <div className="rounded-lg border border-warning/30 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-warning/10">
                    <TableHead>Game</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Total Plays</TableHead>
                    <TableHead className="text-right">Total Tickets</TableHead>
                    <TableHead className="text-right">Avg Tickets/Play</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gameSummaries
                    .filter(g => g.avgTicketsPerPlay > 50)
                    .slice(0, 5)
                    .map((game) => (
                      <TableRow key={game.gameName} className="bg-warning/5">
                        <TableCell className="font-medium">{game.gameName}</TableCell>
                        <TableCell className="text-muted-foreground">{game.gameProfile}</TableCell>
                        <TableCell className="text-right tabular-nums">{game.totalPlays.toLocaleString()}</TableCell>
                        <TableCell className="text-right tabular-nums">{game.totalTickets.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-bold text-warning tabular-nums">
                          {game.avgTicketsPerPlay.toFixed(1)}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

