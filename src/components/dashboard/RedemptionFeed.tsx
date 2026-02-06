'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Gift, Clock, MapPin, Ticket } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RedemptionEvent } from '@/lib/mockData';

interface RedemptionFeedProps {
  redemptions: RedemptionEvent[];
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getRelativeTime(timestamp: string): string {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return past.toLocaleDateString();
}

function getTicketTier(value: number): 'high' | 'medium' | 'low' {
  if (value >= 5000) return 'high';
  if (value >= 1000) return 'medium';
  return 'low';
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export function RedemptionFeed({ redemptions }: RedemptionFeedProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            Redemption Feed
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Recent prize redemptions in real-time
          </p>
        </div>
        <Badge variant="outline" className="gap-1 text-success border-success/30">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
          </span>
          Live
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[420px] px-6 pb-6">
          <div className="space-y-1">
            {redemptions.map((redemption, index) => {
              const tier = getTicketTier(redemption.ticketValue);
              return (
                <div
                  key={redemption.id}
                  className={cn(
                    'group relative rounded-lg p-4 transition-all duration-300 hover:bg-muted/50',
                    'animate-fade-in',
                    index === 0 && 'bg-muted/30'
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10 border-2 border-border shrink-0">
                      <AvatarFallback
                        className={cn(
                          'text-xs font-medium',
                          tier === 'high' && 'bg-primary/20 text-primary',
                          tier === 'medium' && 'bg-warning/20 text-warning',
                          tier === 'low' && 'bg-muted text-muted-foreground'
                        )}
                      >
                        {getInitials(redemption.customerName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-sm truncate">
                          {redemption.customerName}
                        </p>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                          <Clock className="h-3 w-3" />
                          {formatTime(redemption.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/80 mt-1">
                        Redeemed{' '}
                        <span className="font-semibold text-foreground">
                          {redemption.prizeName}
                        </span>
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge
                          variant="secondary"
                          className={cn(
                            'gap-1 text-xs',
                            tier === 'high' && 'bg-primary/10 text-primary border-primary/20',
                            tier === 'medium' && 'bg-warning/10 text-warning border-warning/20',
                            tier === 'low' && 'bg-muted'
                          )}
                        >
                          <Ticket className="h-3 w-3" />
                          {redemption.ticketValue.toLocaleString()}
                        </Badge>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {redemption.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* New item indicator */}
                  {index === 0 && (
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-primary rounded-full" />
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

