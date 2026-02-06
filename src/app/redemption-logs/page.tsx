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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Receipt, Search, Filter, Download, Ticket, MapPin, Clock, Database, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { hasImportedData, loadRedemptions } from '@/lib/csv/store';
import type { RedemptionDetail } from '@/lib/csv/parsers';

export default function RedemptionLogsPage() {
  const [hasData, setHasData] = useState<boolean | null>(null);
  const [redemptions, setRedemptions] = useState<RedemptionDetail[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const dataExists = hasImportedData();
    setHasData(dataExists);

    if (dataExists) {
      setRedemptions(loadRedemptions());
    }
  }, []);

  // Filter redemptions based on search
  const filteredRedemptions = redemptions.filter(r => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      r.cardNumber?.toLowerCase().includes(term) ||
      r.giftCode?.toLowerCase().includes(term) ||
      r.posName?.toLowerCase().includes(term) ||
      r.cashierName?.toLowerCase().includes(term)
    );
  });

  const totalTicketsRedeemed = redemptions.reduce((sum, r) => 
    sum + (r.totalTicketsRedeemed || r.eTicketsRedeemed || r.giftTickets || 0), 0
  );

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
              <Receipt className="h-8 w-8 text-primary" />
              Redemption Logs
            </h1>
            <p className="text-muted-foreground">
              Complete history of prize redemptions
            </p>
          </div>
        </div>

        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-12 text-center">
            <Database className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Redemption Data</h2>
            <p className="text-muted-foreground mb-6">
              Import the Redemption Tickets Details Report from Semnox to view redemption history.
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
            {totalTicketsRedeemed.toLocaleString()} tickets redeemed
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-md bg-muted/50 rounded-lg px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by card, gift code, POS, or cashier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
              Showing {filteredRedemptions.length} of {redemptions.length} entries
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>Redemption ID</TableHead>
                    <TableHead>Card Number</TableHead>
                    <TableHead>Cashier</TableHead>
                    <TableHead className="text-right">E-Tickets</TableHead>
                    <TableHead className="text-right">Gift Tickets</TableHead>
                    <TableHead>Gift Code</TableHead>
                    <TableHead>POS</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRedemptions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        {searchTerm ? 'No results found for your search.' : 'No redemption records.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRedemptions.map((redemption, index) => {
                      const ticketValue = redemption.eTicketsRedeemed || redemption.giftTickets || redemption.totalTicketsLoaded || 0;
                      const isHighValue = ticketValue >= 1000;
                      
                      return (
                        <TableRow
                          key={`${redemption.redemptionId}-${index}`}
                          className={cn(
                            'transition-colors hover:bg-muted/30',
                            index === 0 && 'bg-primary/5'
                          )}
                        >
                          <TableCell className="font-mono text-sm text-muted-foreground">
                            {redemption.redemptionId || '-'}
                          </TableCell>
                          <TableCell>
                            {redemption.cardNumber ? (
                              <span className="font-mono text-sm">{redemption.cardNumber}</span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm">
                            {redemption.cashierName || '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            {redemption.eTicketsRedeemed ? (
                              <Badge
                                variant="secondary"
                                className={cn(
                                  'gap-1 tabular-nums',
                                  redemption.eTicketsRedeemed >= 1000 && 'bg-primary/10 text-primary'
                                )}
                              >
                                <Ticket className="h-3 w-3" />
                                {redemption.eTicketsRedeemed.toLocaleString()}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {redemption.giftTickets ? (
                              <Badge
                                variant="secondary"
                                className={cn(
                                  'gap-1 tabular-nums',
                                  redemption.giftTickets >= 1000 && 'bg-warning/10 text-warning'
                                )}
                              >
                                {redemption.giftTickets.toLocaleString()}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {redemption.giftCode ? (
                              <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                                {redemption.giftCode}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {redemption.posName || '-'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {redemption.redeemedDate.toLocaleDateString()}{' '}
                              {redemption.redeemedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
