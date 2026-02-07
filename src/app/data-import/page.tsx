'use client';

import { useState, useCallback, useEffect } from 'react';
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
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Trash2,
  Database,
  Gamepad2,
  Receipt,
  ClipboardList,
  RefreshCw,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  parseGameMetricReport,
  parseRedemptionReport,
  parseAuditReport,
  parseDashboardReport,
} from '@/lib/csv/parsers';
import {
  saveGameMetrics,
  saveRedemptions,
  saveAuditRecords,
  saveDashboardRecords,
  getDataStoreStats,
  clearAllData,
  type DataStoreStats,
} from '@/lib/csv/store';

interface ImportResult {
  filename: string;
  type: 'game-metrics' | 'redemptions' | 'audit' | 'dashboard' | 'unknown';
  recordCount: number;
  status: 'success' | 'error';
  message: string;
}

export default function DataImportPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [importResults, setImportResults] = useState<ImportResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState<DataStoreStats | null>(null);

  // Load stats on mount
  useEffect(() => {
    setStats(getDataStoreStats());
  }, []);

  const detectReportType = (content: string, headers: string): 'game-metrics' | 'redemptions' | 'audit' | 'dashboard' | 'unknown' => {
    // Check for combined dashboard report first (has record_type column)
    const headerLower = headers.toLowerCase();
    if (headerLower.includes('record_type') && headerLower.includes('card_number')) {
      return 'dashboard';
    }
    
    // Check for standard Semnox reports
    if (content.includes('Game Metric Report')) return 'game-metrics';
    if (content.includes('Redemption Tickets Details Report')) return 'redemptions';
    if (content.includes('Master Audit Report')) return 'audit';
    
    return 'unknown';
  };

  const processFile = async (file: File): Promise<ImportResult> => {
    try {
      const content = await file.text();
      const firstLine = content.split('\n')[0] || '';
      const reportType = detectReportType(content, firstLine);

      if (reportType === 'unknown') {
        return {
          filename: file.name,
          type: 'unknown',
          recordCount: 0,
          status: 'error',
          message: 'Unknown report format. Upload a Semnox CSV or Combined Dashboard Report.',
        };
      }

      let recordCount = 0;

      switch (reportType) {
        case 'game-metrics': {
          const data = parseGameMetricReport(content);
          saveGameMetrics(data);
          recordCount = data.length;
          break;
        }
        case 'redemptions': {
          const data = parseRedemptionReport(content);
          saveRedemptions(data);
          recordCount = data.length;
          break;
        }
        case 'audit': {
          const data = parseAuditReport(content);
          saveAuditRecords(data);
          recordCount = data.length;
          break;
        }
        case 'dashboard': {
          const data = parseDashboardReport(content);
          saveDashboardRecords(data);
          recordCount = data.length;
          break;
        }
      }

      return {
        filename: file.name,
        type: reportType,
        recordCount,
        status: 'success',
        message: `Successfully imported ${recordCount} records`,
      };
    } catch (error) {
      return {
        filename: file.name,
        type: 'unknown',
        recordCount: 0,
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to process file',
      };
    }
  };

  const handleFiles = async (files: FileList) => {
    setIsProcessing(true);
    const results: ImportResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.name.endsWith('.csv')) {
        const result = await processFile(file);
        results.push(result);
      }
    }

    setImportResults((prev) => [...results, ...prev]);
    setStats(getDataStoreStats());
    setIsProcessing(false);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all imported data?')) {
      clearAllData();
      setStats(getDataStoreStats());
      setImportResults([]);
    }
  };

  const getReportTypeIcon = (type: ImportResult['type']) => {
    switch (type) {
      case 'game-metrics':
        return <Gamepad2 className="h-4 w-4" />;
      case 'redemptions':
        return <Receipt className="h-4 w-4" />;
      case 'audit':
        return <ClipboardList className="h-4 w-4" />;
      case 'dashboard':
        return <Activity className="h-4 w-4" />;
      default:
        return <FileSpreadsheet className="h-4 w-4" />;
    }
  };

  const getReportTypeName = (type: ImportResult['type']) => {
    switch (type) {
      case 'game-metrics':
        return 'Game Metrics';
      case 'redemptions':
        return 'Redemptions';
      case 'audit':
        return 'Audit Log';
      case 'dashboard':
        return 'Combined Dashboard';
      default:
        return 'Unknown';
    }
  };

  const totalRecords = (stats?.gameMetricsCount || 0) + 
    (stats?.redemptionsCount || 0) + 
    (stats?.auditRecordsCount || 0) +
    (stats?.dashboardRecordsCount || 0);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Database className="h-8 w-8 text-primary" />
            Data Import
          </h1>
          <p className="text-muted-foreground">
            Import CSV reports exported from Semnox Parafait
          </p>
        </div>
        {stats && stats.lastImport && (
          <div className="text-sm text-muted-foreground">
            Last import: {stats.lastImport.toLocaleString()}
          </div>
        )}
      </div>

      {/* Data Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Gamepad2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Game Metrics</p>
                <p className="text-2xl font-bold tabular-nums">
                  {stats?.gameMetricsCount || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                <Receipt className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Redemption Records</p>
                <p className="text-2xl font-bold tabular-nums">
                  {stats?.redemptionsCount || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan/10">
                <Activity className="h-6 w-6 text-cyan" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Transaction Records</p>
                <p className="text-2xl font-bold tabular-nums">
                  {stats?.dashboardRecordsCount || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
                <ClipboardList className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Audit Records</p>
                <p className="text-2xl font-bold tabular-nums">
                  {stats?.auditRecordsCount || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Zone */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Upload CSV Reports
            </span>
            {totalRecords > 0 && (
              <button
                onClick={handleClearData}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 text-sm font-medium transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Clear All Data
              </button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
              'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-all',
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 hover:bg-muted/30',
              isProcessing && 'pointer-events-none opacity-50'
            )}
          >
            {isProcessing ? (
              <RefreshCw className="h-12 w-12 text-primary animate-spin mb-4" />
            ) : (
              <Upload className="h-12 w-12 text-muted-foreground mb-4" />
            )}
            <p className="text-lg font-medium mb-2">
              {isProcessing ? 'Processing...' : 'Drag & drop CSV files here'}
            </p>
            <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
              Supported: Game Metric Report, Redemption Tickets Details, Master Audit Report, 
              or Combined Dashboard Report (custom SQL export)
            </p>
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer transition-colors font-medium">
              <FileSpreadsheet className="h-4 w-4" />
              Browse Files
              <input
                type="file"
                accept=".csv"
                multiple
                onChange={handleFileInput}
                className="hidden"
              />
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Import Results */}
      {importResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Import History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>Status</TableHead>
                    <TableHead>File</TableHead>
                    <TableHead>Report Type</TableHead>
                    <TableHead className="text-right">Records</TableHead>
                    <TableHead>Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {importResults.map((result, index) => (
                    <TableRow
                      key={index}
                      className={cn(
                        result.status === 'error' && 'bg-destructive/5'
                      )}
                    >
                      <TableCell>
                        {result.status === 'success' ? (
                          <CheckCircle className="h-5 w-5 text-success" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-destructive" />
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {result.filename}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="gap-1"
                        >
                          {getReportTypeIcon(result.type)}
                          {getReportTypeName(result.type)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right tabular-nums font-medium">
                        {result.recordCount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {result.message}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="border-border/50 bg-muted/20">
        <CardHeader>
          <CardTitle className="text-base">How to Export Reports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-sm text-muted-foreground">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="font-medium text-foreground flex items-center gap-2">
                <Gamepad2 className="h-4 w-4 text-primary" />
                Standard Semnox Reports
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Game Metric Report → Reports → Game Reports</li>
                <li>Redemption Tickets Details → Reports → Inventory</li>
                <li>Master Audit Report → Reports → System</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-foreground flex items-center gap-2">
                <Activity className="h-4 w-4 text-cyan" />
                Combined Dashboard Report (Custom SQL)
              </p>
              <p>Run the combined SQL query from the Semnox web portal to export transactions and redemptions in a single file with these columns:</p>
              <code className="block bg-muted p-2 rounded text-xs mt-2">
                record_type, card_number, customer_name, timestamp, game_name, machine_name, credits_spent, tickets_earned, current_ticket_balance, redemption_id, gift_code, pos_name
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
