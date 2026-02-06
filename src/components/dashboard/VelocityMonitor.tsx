'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, AlertTriangle } from 'lucide-react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import type { VelocityData } from '@/lib/mockData';
import { THRESHOLDS } from '@/lib/mockData';

interface VelocityMonitorProps {
  velocityData: VelocityData[];
}

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as VelocityData;
    return (
      <div className="rounded-lg border border-border bg-popover p-3 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground">Card ID</span>
            <span className="font-mono text-sm font-medium">{data.cardId}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground">Game</span>
            <span className="text-sm">{data.gameName}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground">Tickets Earned</span>
            <span className="text-sm font-semibold text-primary">
              {data.ticketsEarned.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground">Rate</span>
            <span
              className={`text-sm font-bold ${
                data.status === 'critical'
                  ? 'text-destructive'
                  : data.status === 'warning'
                  ? 'text-warning'
                  : 'text-success'
              }`}
            >
              {data.ticketsPerMinute} TPM
            </span>
          </div>
          {data.status !== 'normal' && (
            <div className="flex items-center gap-1 pt-1 border-t border-border">
              <AlertTriangle
                className={`h-3 w-3 ${
                  data.status === 'critical' ? 'text-destructive' : 'text-warning'
                }`}
              />
              <span
                className={`text-xs font-medium ${
                  data.status === 'critical' ? 'text-destructive' : 'text-warning'
                }`}
              >
                {data.status === 'critical' ? 'Potential Exploit' : 'Above Normal'}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export function VelocityMonitor({ velocityData }: VelocityMonitorProps) {
  // Transform data for scatter plot
  const chartData = velocityData.map((item, index) => ({
    ...item,
    x: index + 1,
    y: item.ticketsPerMinute,
  }));

  const getPointColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'hsl(0, 72%, 51%)';
      case 'warning':
        return 'hsl(38, 92%, 50%)';
      default:
        return 'hsl(174, 70%, 45%)';
    }
  };

  const anomalyCount = velocityData.filter((d) => d.status !== 'normal').length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Velocity Monitor
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Ticket acquisition rate (Tickets per Minute)
          </p>
        </div>
        {anomalyCount > 0 && (
          <Badge variant="destructive" className="gap-1 animate-pulse">
            <AlertTriangle className="h-3 w-3" />
            {anomalyCount} Anomalies
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(235, 15%, 28%)"
                vertical={false}
              />
              <XAxis
                type="number"
                dataKey="x"
                name="Session"
                tick={{ fill: 'hsl(235, 10%, 65%)', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(235, 15%, 28%)' }}
                tickLine={{ stroke: 'hsl(235, 15%, 28%)' }}
                label={{
                  value: 'Session Index',
                  position: 'bottom',
                  fill: 'hsl(235, 10%, 65%)',
                  fontSize: 12,
                }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="TPM"
                tick={{ fill: 'hsl(235, 10%, 65%)', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(235, 15%, 28%)' }}
                tickLine={{ stroke: 'hsl(235, 15%, 28%)' }}
                label={{
                  value: 'Tickets per Minute',
                  angle: -90,
                  position: 'insideLeft',
                  fill: 'hsl(235, 10%, 65%)',
                  fontSize: 12,
                }}
              />
              {/* Warning threshold line */}
              <ReferenceLine
                y={THRESHOLDS.TICKETS_PER_MINUTE_WARNING}
                stroke="hsl(38, 92%, 50%)"
                strokeDasharray="5 5"
                label={{
                  value: 'Warning',
                  fill: 'hsl(38, 92%, 50%)',
                  fontSize: 11,
                  position: 'right',
                }}
              />
              {/* Critical threshold line */}
              <ReferenceLine
                y={THRESHOLDS.TICKETS_PER_MINUTE_CRITICAL}
                stroke="hsl(0, 72%, 51%)"
                strokeDasharray="5 5"
                label={{
                  value: 'Critical',
                  fill: 'hsl(0, 72%, 51%)',
                  fontSize: 11,
                  position: 'right',
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Scatter name="Sessions" data={chartData}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getPointColor(entry.status)}
                    stroke={getPointColor(entry.status)}
                    strokeWidth={2}
                    r={entry.status === 'critical' ? 10 : entry.status === 'warning' ? 8 : 6}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Normal (&lt;{THRESHOLDS.TICKETS_PER_MINUTE_WARNING} TPM)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-warning" />
            <span className="text-xs text-muted-foreground">Warning ({THRESHOLDS.TICKETS_PER_MINUTE_WARNING}-{THRESHOLDS.TICKETS_PER_MINUTE_CRITICAL} TPM)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-destructive" />
            <span className="text-xs text-muted-foreground">Critical (&gt;{THRESHOLDS.TICKETS_PER_MINUTE_CRITICAL} TPM)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
