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
import { Shield, AlertTriangle, Clock, Eye, Ban, CheckCircle, Database, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
  hasImportedData,
  getGameSummaries,
  getCardSummaries,
} from '@/lib/csv/store';
import type { GamePerformanceSummary, CardRedemptionSummary } from '@/lib/csv/parsers';

// Configurable thresholds
const THRESHOLDS = {
  TICKETS_PER_PLAY_WARNING: 50,
  TICKETS_PER_PLAY_CRITICAL: 100,
  HIGH_REDEMPTION_WARNING: 2000,
  HIGH_REDEMPTION_CRITICAL: 5000,
};

export default function FraudDetectionPage() {
  const [hasData, setHasData] = useState<boolean | null>(null);
  const [suspiciousGames, setSuspiciousGames] = useState<GamePerformanceSummary[]>([]);
  const [highRedemptionCards, setHighRedemptionCards] = useState<CardRedemptionSummary[]>([]);

  useEffect(() => {
    const dataExists = hasImportedData();
    setHasData(dataExists);

    if (dataExists) {
      const games = getGameSummaries();
      const cards = getCardSummaries();

      // Find games with suspicious payout rates
      setSuspiciousGames(
        games.filter(g => g.avgTicketsPerPlay >= THRESHOLDS.TICKETS_PER_PLAY_WARNING)
          .sort((a, b) => b.avgTicketsPerPlay - a.avgTicketsPerPlay)
      );

      // Find cards with high redemption volumes
      setHighRedemptionCards(
        cards.filter(c => c.totalTicketsRedeemed >= THRESHOLDS.HIGH_REDEMPTION_WARNING)
          .sort((a, b) => b.totalTicketsRedeemed - a.totalTicketsRedeemed)
      );
    }
  }, []);

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
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Shield className="h-8 w-8 text-destructive" />
              Fraud Detection
            </h1>
            <p className="text-muted-foreground">
              Monitor suspicious activity and potential system exploits
            </p>
          </div>
        </div>

        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-12 text-center">
            <Database className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Data Available</h2>
            <p className="text-muted-foreground mb-6">
              Import CSV reports to start detecting anomalies and potential exploits.
            </p>
            <Link
              href="/data-import"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors"
            >
              <Upload className="h-5 w-5" />
              Import CSV Data
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalAlerts = suspiciousGames.length + highRedemptionCards.length;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Shield className="h-8 w-8 text-destructive" />
            Fraud Detection
          </h1>
          <p className="text-muted-foreground">
            Monitor suspicious activity and potential system exploits
          </p>
        </div>
        {totalAlerts > 0 ? (
          <Badge variant="destructive" className="gap-2 px-4 py-2 text-sm animate-pulse">
            <AlertTriangle className="h-4 w-4" />
            {totalAlerts} Active Alerts
          </Badge>
        ) : (
          <Badge variant="secondary" className="gap-2 px-4 py-2 text-sm bg-success/20 text-success">
            <CheckCircle className="h-4 w-4" />
            No Alerts
          </Badge>
        )}
      </div>

      {/* Alert Rules Info */}
      <Card className="border-warning/30 bg-warning/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium text-sm">Active Detection Rules</p>
              <p className="text-sm text-muted-foreground">
                Game Warning: <span className="font-mono text-warning">{THRESHOLDS.TICKETS_PER_PLAY_WARNING}+ avg tickets/play</span> • 
                Game Critical: <span className="font-mono text-destructive">{THRESHOLDS.TICKETS_PER_PLAY_CRITICAL}+ avg tickets/play</span> • 
                Card Warning: <span className="font-mono text-warning">{THRESHOLDS.HIGH_REDEMPTION_WARNING.toLocaleString()}+ tickets redeemed</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suspicious Games */}
      {suspiciousGames.length > 0 && (
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              High Payout Games ({suspiciousGames.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              These games have unusually high ticket-per-play averages. Investigate for potential exploits or misconfiguration.
            </p>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>Game Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Total Plays</TableHead>
                    <TableHead className="text-right">Total Tickets</TableHead>
                    <TableHead className="text-right">Avg Tickets/Play</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suspiciousGames.map((game) => {
                    const isCritical = game.avgTicketsPerPlay >= THRESHOLDS.TICKETS_PER_PLAY_CRITICAL;
                    return (
                      <TableRow
                        key={game.gameName}
                        className={cn(
                          isCritical ? 'bg-destructive/5' : 'bg-warning/5'
                        )}
                      >
                        <TableCell className="font-medium">{game.gameName}</TableCell>
                        <TableCell className="text-muted-foreground">{game.gameProfile}</TableCell>
                        <TableCell className="text-right tabular-nums">{game.totalPlays.toLocaleString()}</TableCell>
                        <TableCell className="text-right tabular-nums">{game.totalTickets.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <span className={cn(
                            'font-mono font-bold',
                            isCritical ? 'text-destructive' : 'text-warning'
                          )}>
                            {game.avgTicketsPerPlay.toFixed(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {isCritical ? (
                            <Badge variant="destructive" className="gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Critical
                            </Badge>
                          ) : (
                            <Badge className="gap-1 bg-warning/20 text-warning border-warning/30">
                              <Clock className="h-3 w-3" />
                              Warning
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 rounded-lg hover:bg-muted transition-colors" title="Investigate">
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-destructive/10 transition-colors" title="Disable Game">
                              <Ban className="h-4 w-4 text-destructive" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* High Redemption Cards */}
      {highRedemptionCards.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              High Redemption Cards ({highRedemptionCards.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Cards with unusually high redemption volumes. May indicate legitimate high-value customers or potential abuse.
            </p>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>Card Number</TableHead>
                    <TableHead className="text-right">Tickets Redeemed</TableHead>
                    <TableHead className="text-right">Transactions</TableHead>
                    <TableHead>Last Redemption</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {highRedemptionCards.map((card) => {
                    const isCritical = card.totalTicketsRedeemed >= THRESHOLDS.HIGH_REDEMPTION_CRITICAL;
                    return (
                      <TableRow
                        key={card.cardNumber}
                        className={cn(
                          isCritical ? 'bg-destructive/5' : 'bg-warning/5'
                        )}
                      >
                        <TableCell className="font-mono text-sm">{card.cardNumber}</TableCell>
                        <TableCell className="text-right font-semibold tabular-nums">
                          {card.totalTicketsRedeemed.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{card.totalTransactions}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {card.lastRedemption.toLocaleDateString()} {card.lastRedemption.toLocaleTimeString()}
                        </TableCell>
                        <TableCell>
                          {isCritical ? (
                            <Badge variant="destructive" className="gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Critical
                            </Badge>
                          ) : (
                            <Badge className="gap-1 bg-warning/20 text-warning border-warning/30">
                              <Clock className="h-3 w-3" />
                              Warning
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 rounded-lg hover:bg-muted transition-colors" title="Investigate">
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-destructive/10 transition-colors" title="Block Card">
                              <Ban className="h-4 w-4 text-destructive" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-success/10 transition-colors" title="Mark as Reviewed">
                              <CheckCircle className="h-4 w-4 text-success" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Alerts State */}
      {suspiciousGames.length === 0 && highRedemptionCards.length === 0 && (
        <Card className="border-success/30 bg-success/5">
          <CardContent className="p-12 text-center">
            <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">All Clear</h2>
            <p className="text-muted-foreground">
              No suspicious activity detected based on current thresholds. 
              Continue monitoring or adjust thresholds if needed.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
