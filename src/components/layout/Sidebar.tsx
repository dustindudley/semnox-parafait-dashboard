'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Shield,
  Receipt,
  TrendingUp,
  Settings,
  Bell,
  LogOut,
  Upload,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  hasImportedData,
  getGameSummaries,
  getCardSummaries,
  loadRedemptions,
} from '@/lib/csv/store';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  badgeVariant?: 'default' | 'destructive' | 'warning';
}

// Thresholds for counting alerts
const THRESHOLDS = {
  TICKETS_PER_PLAY_WARNING: 50,
  HIGH_REDEMPTION_WARNING: 2000,
};

export function Sidebar() {
  const pathname = usePathname();
  const [alertCounts, setAlertCounts] = useState({
    fraudAlerts: 0,
    totalAlerts: 0,
    hasData: false,
  });

  useEffect(() => {
    // Calculate alert counts from imported data
    const dataExists = hasImportedData();
    
    if (dataExists) {
      const games = getGameSummaries();
      const cards = getCardSummaries();
      
      // Count suspicious games
      const suspiciousGames = games.filter(g => g.avgTicketsPerPlay >= THRESHOLDS.TICKETS_PER_PLAY_WARNING).length;
      
      // Count high-redemption cards
      const highRedemptionCards = cards.filter(c => c.totalTicketsRedeemed >= THRESHOLDS.HIGH_REDEMPTION_WARNING).length;
      
      setAlertCounts({
        fraudAlerts: suspiciousGames + highRedemptionCards,
        totalAlerts: suspiciousGames + highRedemptionCards,
        hasData: true,
      });
    } else {
      setAlertCounts({
        fraudAlerts: 0,
        totalAlerts: 0,
        hasData: false,
      });
    }
  }, [pathname]); // Re-check when navigating

  const mainNavItems: NavItem[] = [
    {
      name: 'Overview',
      href: '/',
      icon: LayoutDashboard,
    },
    {
      name: 'Fraud Detection',
      href: '/fraud-detection',
      icon: Shield,
      badge: alertCounts.fraudAlerts > 0 ? alertCounts.fraudAlerts : undefined,
      badgeVariant: 'destructive',
    },
    {
      name: 'Redemption Logs',
      href: '/redemption-logs',
      icon: Receipt,
    },
  ];

  const secondaryNavItems: NavItem[] = [
    {
      name: 'Data Import',
      href: '/data-import',
      icon: Upload,
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: TrendingUp,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ];

  return (
    <aside className="flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-sidebar-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <TrendingUp className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-sidebar-foreground">Semnox</span>
          <span className="text-xs text-sidebar-foreground/60">Parafait Analytics</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <div className="px-3 py-2">
          <h3 className="text-xs font-medium uppercase tracking-wider text-sidebar-foreground/50">
            Main Menu
          </h3>
        </div>
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              )}
            >
              <item.icon
                className={cn(
                  'h-5 w-5 transition-colors',
                  isActive ? 'text-primary' : 'text-sidebar-foreground/50'
                )}
              />
              <span className="flex-1">{item.name}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <Badge
                  variant={item.badgeVariant === 'destructive' ? 'destructive' : 'secondary'}
                  className={cn(
                    'h-5 min-w-5 px-1.5 text-xs font-semibold',
                    item.badgeVariant === 'warning' && 'bg-warning text-warning-foreground',
                    item.badgeVariant === 'destructive' && 'animate-pulse'
                  )}
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}

        <Separator className="my-4 bg-sidebar-border" />

        <div className="px-3 py-2">
          <h3 className="text-xs font-medium uppercase tracking-wider text-sidebar-foreground/50">
            Tools
          </h3>
        </div>
        {secondaryNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              )}
            >
              <item.icon
                className={cn(
                  'h-5 w-5 transition-colors',
                  isActive ? 'text-primary' : 'text-sidebar-foreground/50'
                )}
              />
              <span className="flex-1">{item.name}</span>
            </Link>
          );
        })}
        
        {/* Data Status Indicator */}
        {!alertCounts.hasData && (
          <div className="mt-4 mx-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
            <p className="text-xs text-warning font-medium">No data imported</p>
            <p className="text-xs text-muted-foreground mt-1">
              Import CSV reports to see analytics
            </p>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground cursor-pointer transition-colors">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent">
            <span className="text-xs font-semibold">AD</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-sidebar-foreground/50">Manager</p>
          </div>
          <LogOut className="h-4 w-4 text-sidebar-foreground/50" />
        </div>
      </div>
    </aside>
  );
}
