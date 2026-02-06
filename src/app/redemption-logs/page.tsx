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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Receipt, Search, Filter, Download, Ticket, MapPin, Clock } from 'lucide-react';
import { mockRedemptions } from '@/lib/mockData';
import { cn } from '@/lib/utils';

export default function RedemptionLogsPage() {
  const totalTicketsRedeemed = mockRedemptions.reduce((sum, r) => sum + r.ticketValue, 0);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Receipt className="h-8 w-8 text-primary" />
            Redemption Logs
          </h1>
          <p className="text-muted-foreground">
            Complete history of prize redemptions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="gap-2 px-4 py-2">
            <Ticket className="h-4 w-4" />
            {totalTicketsRedeemed.toLocaleString()} tickets redeemed today
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-md">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by card ID, customer, or prize..."
                className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm font-medium transition-colors">
                <Filter className="h-4 w-4" />
                Filters
              </button>
              <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm font-medium transition-colors">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Redemption Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              Recent Redemptions
            </span>
            <span className="text-sm font-normal text-muted-foreground">
              Showing {mockRedemptions.length} entries
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Prize</TableHead>
                    <TableHead className="text-right">Ticket Value</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRedemptions.map((redemption, index) => (
                    <TableRow
                      key={redemption.id}
                      className={cn(
                        'transition-colors hover:bg-muted/30',
                        index === 0 && 'bg-primary/5'
                      )}
                    >
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {redemption.id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{redemption.customerName}</p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {redemption.cardNumber}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{redemption.prizeName}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant="secondary"
                          className={cn(
                            'gap-1 tabular-nums',
                            redemption.ticketValue >= 5000 && 'bg-primary/10 text-primary',
                            redemption.ticketValue >= 1000 &&
                              redemption.ticketValue < 5000 &&
                              'bg-warning/10 text-warning'
                          )}
                        >
                          <Ticket className="h-3 w-3" />
                          {redemption.ticketValue.toLocaleString()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {redemption.location}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(redemption.timestamp).toLocaleTimeString()}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

