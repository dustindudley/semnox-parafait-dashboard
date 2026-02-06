'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  CreditCard,
  Ticket,
  AlertTriangle,
  Gift,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DashboardStats } from '@/lib/mockData';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  variant?: 'default' | 'warning' | 'critical';
}

function StatCard({
  title,
  value,
  icon: Icon,
  change,
  changeType = 'neutral',
  variant = 'default',
}: StatCardProps) {
  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-300 hover:scale-[1.02]',
        variant === 'warning' && 'border-warning/30 glow-warning',
        variant === 'critical' && 'border-destructive/30 glow-critical'
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight tabular-nums">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {change && (
              <p
                className={cn(
                  'text-xs font-medium flex items-center gap-1',
                  changeType === 'positive' && 'text-success',
                  changeType === 'negative' && 'text-destructive',
                  changeType === 'neutral' && 'text-muted-foreground'
                )}
              >
                {changeType === 'positive' && <TrendingUp className="h-3 w-3" />}
                {change}
              </p>
            )}
          </div>
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-xl',
              variant === 'default' && 'bg-primary/10',
              variant === 'warning' && 'bg-warning/10',
              variant === 'critical' && 'bg-destructive/10'
            )}
          >
            <Icon
              className={cn(
                'h-6 w-6',
                variant === 'default' && 'text-primary',
                variant === 'warning' && 'text-warning',
                variant === 'critical' && 'text-destructive'
              )}
            />
          </div>
        </div>
      </CardContent>
      {/* Decorative gradient */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 h-1',
          variant === 'default' && 'bg-gradient-to-r from-primary/50 via-primary to-primary/50',
          variant === 'warning' && 'bg-gradient-to-r from-warning/50 via-warning to-warning/50',
          variant === 'critical' && 'bg-gradient-to-r from-destructive/50 via-destructive to-destructive/50'
        )}
      />
    </Card>
  );
}

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <StatCard
        title="Active Cards"
        value={stats.totalActiveCards}
        icon={CreditCard}
        change="+12% from last week"
        changeType="positive"
      />
      <StatCard
        title="Tickets in Circulation"
        value={stats.totalTicketsCirculation}
        icon={Ticket}
        change="+8.2% from yesterday"
        changeType="positive"
      />
      <StatCard
        title="Active Alerts"
        value={stats.alertsCount}
        icon={AlertTriangle}
        variant={stats.alertsCount > 3 ? 'warning' : 'default'}
        change="2 new in last hour"
        changeType="negative"
      />
      <StatCard
        title="Redemptions Today"
        value={stats.redemptionsToday}
        icon={Gift}
        change="+5% from average"
        changeType="positive"
      />
      <StatCard
        title="Avg Tickets/Hour"
        value={stats.avgTicketsPerHour}
        icon={TrendingUp}
        change="Normal range"
        changeType="neutral"
      />
      <StatCard
        title="Suspicious Activity"
        value={stats.suspiciousActivities}
        icon={ShieldAlert}
        variant={stats.suspiciousActivities > 0 ? 'critical' : 'default'}
        change="Requires attention"
        changeType="negative"
      />
    </div>
  );
}

