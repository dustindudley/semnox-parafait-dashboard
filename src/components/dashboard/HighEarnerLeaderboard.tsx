'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CardHolder } from '@/lib/mockData';
import { THRESHOLDS } from '@/lib/mockData';

interface HighEarnerLeaderboardProps {
  cardHolders: CardHolder[];
}

export function HighEarnerLeaderboard({ cardHolders }: HighEarnerLeaderboardProps) {
  const sortedHolders = [...cardHolders].sort((a, b) => b.ticketBalance - a.ticketBalance);

  const getStatusBadge = (status: CardHolder['status'], ticketsPerMinute: number) => {
    if (status === 'critical') {
      return (
        <Badge variant="destructive" className="gap-1 animate-pulse">
          <AlertTriangle className="h-3 w-3" />
          Critical
        </Badge>
      );
    }
    if (status === 'warning') {
      return (
        <Badge className="gap-1 bg-warning/20 text-warning hover:bg-warning/30 border-warning/30">
          <TrendingUp className="h-3 w-3" />
          Warning
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="gap-1 bg-success/10 text-success border-success/20">
        Normal
      </Badge>
    );
  };

  const getRankIndicator = (index: number) => {
    if (index === 0) {
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 text-black">
          <Trophy className="h-4 w-4" />
        </div>
      );
    }
    if (index === 1) {
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gray-300 to-gray-500 text-black">
          <span className="text-sm font-bold">2</span>
        </div>
      );
    }
    if (index === 2) {
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-600 to-amber-800 text-white">
          <span className="text-sm font-bold">3</span>
        </div>
      );
    }
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <span className="text-sm font-medium">{index + 1}</span>
      </div>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            High-Earner Leaderboard
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Cards with highest ticket balances and recent activity
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          Live Data
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Card Holder</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead className="text-right">Recent Earnings</TableHead>
                <TableHead className="text-right">
                  <span className="flex items-center justify-end gap-1">
                    <Clock className="h-3 w-3" />
                    TPM
                  </span>
                </TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedHolders.map((holder, index) => (
                <TableRow
                  key={holder.cardId}
                  className={cn(
                    'transition-colors',
                    holder.status === 'critical' && 'bg-destructive/5 hover:bg-destructive/10',
                    holder.status === 'warning' && 'bg-warning/5 hover:bg-warning/10'
                  )}
                >
                  <TableCell>{getRankIndicator(index)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border-2 border-border">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                          {getInitials(holder.customerName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{holder.customerName}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {holder.cardNumber}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={cn(
                        'font-semibold tabular-nums',
                        holder.ticketBalance >= THRESHOLDS.HIGH_BALANCE_CRITICAL &&
                          'text-destructive',
                        holder.ticketBalance >= THRESHOLDS.HIGH_BALANCE_WARNING &&
                          holder.ticketBalance < THRESHOLDS.HIGH_BALANCE_CRITICAL &&
                          'text-warning'
                      )}
                    >
                      {holder.ticketBalance.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground text-xs ml-1">tickets</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm tabular-nums text-success">
                      +{holder.recentEarnings.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={cn(
                        'font-mono text-sm tabular-nums',
                        holder.ticketsPerMinute >= THRESHOLDS.TICKETS_PER_MINUTE_CRITICAL &&
                          'text-destructive font-bold',
                        holder.ticketsPerMinute >= THRESHOLDS.TICKETS_PER_MINUTE_WARNING &&
                          holder.ticketsPerMinute < THRESHOLDS.TICKETS_PER_MINUTE_CRITICAL &&
                          'text-warning font-semibold'
                      )}
                    >
                      {holder.ticketsPerMinute}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(holder.status, holder.ticketsPerMinute)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

