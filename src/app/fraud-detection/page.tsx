'use client';

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
import { Shield, AlertTriangle, Clock, Eye, Ban, CheckCircle } from 'lucide-react';
import { mockCardHolders, THRESHOLDS } from '@/lib/mockData';
import { cn } from '@/lib/utils';

export default function FraudDetectionPage() {
  const suspiciousCards = mockCardHolders.filter((card) => card.status !== 'normal');

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
        <Badge variant="destructive" className="gap-2 px-4 py-2 text-sm animate-pulse">
          <AlertTriangle className="h-4 w-4" />
          {suspiciousCards.length} Active Alerts
        </Badge>
      </div>

      {/* Alert Rules Info */}
      <Card className="border-warning/30 bg-warning/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium text-sm">Active Detection Rules</p>
              <p className="text-sm text-muted-foreground">
                Warning triggered at <span className="font-mono text-warning">{THRESHOLDS.TICKETS_PER_MINUTE_WARNING}+ TPM</span> • 
                Critical alert at <span className="font-mono text-destructive">{THRESHOLDS.TICKETS_PER_MINUTE_CRITICAL}+ TPM</span> • 
                High balance flag at <span className="font-mono text-warning">{THRESHOLDS.HIGH_BALANCE_WARNING.toLocaleString()}+ tickets</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suspicious Activity Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Cards Under Investigation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Card ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Ticket Balance</TableHead>
                  <TableHead className="text-right">TPM Rate</TableHead>
                  <TableHead>Alert Level</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suspiciousCards.map((card) => (
                  <TableRow
                    key={card.cardId}
                    className={cn(
                      card.status === 'critical' && 'bg-destructive/5',
                      card.status === 'warning' && 'bg-warning/5'
                    )}
                  >
                    <TableCell className="font-mono text-sm">{card.cardId}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{card.customerName}</p>
                        <p className="text-xs text-muted-foreground">{card.cardNumber}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {card.ticketBalance.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={cn(
                          'font-mono font-bold',
                          card.status === 'critical' && 'text-destructive',
                          card.status === 'warning' && 'text-warning'
                        )}
                      >
                        {card.ticketsPerMinute}
                      </span>
                    </TableCell>
                    <TableCell>
                      {card.status === 'critical' ? (
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
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(card.lastActivity).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 rounded-lg hover:bg-muted transition-colors" title="Investigate">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-destructive/10 transition-colors" title="Block Card">
                          <Ban className="h-4 w-4 text-destructive" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-success/10 transition-colors" title="Mark as Resolved">
                          <CheckCircle className="h-4 w-4 text-success" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

