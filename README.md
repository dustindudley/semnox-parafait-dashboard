# Semnox Parafait Analytics Dashboard

A real-time analytics dashboard for monitoring ticket earnings, detecting potential exploits, and tracking redemptions in arcade/FEC environments running Semnox Parafait systems.

**Live Demo:** Deployed on Vercel  
**Repository:** https://github.com/dustindudley/semnox-parafait-dashboard

---

## 🎯 Project Goals

1. **Fraud Detection** - Identify cards earning tickets faster than normal game cycles (velocity monitoring)
2. **High-Earner Tracking** - Monitor players with unusually high ticket balances
3. **Redemption Analysis** - Track prize redemptions and identify patterns
4. **Game Performance** - Analyze which games have high payout rates (potential exploits or misconfiguration)

---

## 📊 Current Implementation Status

### ✅ Completed Features

| Feature | Status | Description |
|---------|--------|-------------|
| Dashboard Overview | ✅ Done | KPI cards, leaderboard, charts |
| CSV Import System | ✅ Done | Drag-drop upload, auto-detect report type |
| Game Metrics Analysis | ✅ Done | Parse Game Metric Report CSV |
| Redemption Tracking | ✅ Done | Parse Redemption Tickets Details CSV |
| Audit Log Viewer | ✅ Done | Parse Master Audit Report CSV |
| Combined Report Support | ✅ Done | Custom SQL export with TRANSACTION/REDEMPTION records |
| Fraud Detection Page | ✅ Done | High-payout games, high-redemption cards |
| Dynamic Sidebar Badges | ✅ Done | Alert counts based on actual data |
| Dark Fintech Theme | ✅ Done | Professional UI with Tailwind CSS |

### 🔄 Partially Implemented

| Feature | Status | Notes |
|---------|--------|-------|
| Velocity Monitor (TPM) | 🔄 Partial | Needs per-transaction data with timestamps from SQL export |
| Real-time Updates | 🔄 Partial | Manual refresh only; no live API connection yet |

### 📋 Not Yet Implemented

| Feature | Notes |
|---------|-------|
| Direct Semnox API Integration | Requires API credentials and endpoint documentation |
| User Authentication | Currently open access |
| Threshold Configuration UI | Thresholds are hardcoded; could be user-configurable |
| Email/SMS Alerts | No notification system |
| Historical Trend Charts | Only shows current snapshot |

---

## 🏗️ Architecture

### Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v3
- **Components:** Shadcn/UI (Radix primitives)
- **Charts:** Recharts
- **Icons:** Lucide React
- **Storage:** localStorage (client-side persistence)

### File Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Overview dashboard (main)
│   ├── fraud-detection/page.tsx  # Fraud alerts & investigation
│   ├── redemption-logs/page.tsx  # Redemption history table
│   ├── analytics/page.tsx        # Charts & insights from imported data
│   ├── data-import/page.tsx      # CSV upload interface
│   ├── layout.tsx                # Root layout with sidebar
│   └── globals.css               # Theme variables & global styles
│
├── components/
│   ├── dashboard/
│   │   ├── StatsCards.tsx        # KPI summary cards
│   │   ├── HighEarnerLeaderboard.tsx  # Top cards by tickets
│   │   ├── VelocityMonitor.tsx   # TPM scatter plot
│   │   └── RedemptionFeed.tsx    # Live redemption list
│   ├── layout/
│   │   └── Sidebar.tsx           # Navigation with dynamic badges
│   └── ui/                       # Shadcn/UI components
│
├── lib/
│   ├── csv/
│   │   ├── parsers.ts            # CSV parsing logic for all report types
│   │   └── store.ts              # localStorage persistence layer
│   ├── api/
│   │   ├── config.ts             # API configuration (for future use)
│   │   └── semnox.ts             # Semnox API client (currently unused)
│   ├── mockData.ts               # Type definitions (mock data removed)
│   └── utils.ts                  # Utility functions (cn, etc.)
```

---

## 📁 Data Sources

### Supported CSV Formats

#### 1. Game Metric Report (Standard Semnox Export)
- **Source:** Semnox Web Portal → Reports → Game Reports
- **Contains:** Game names, play counts, tickets dispensed, revenue, payout %
- **Key fields parsed:** `Game Name`, `Total Plays`, `Tickets`, `Credits`, `PO%`

#### 2. Redemption Tickets Details Report (Standard Semnox Export)
- **Source:** Semnox Web Portal → Reports → Inventory
- **Contains:** Card numbers, tickets redeemed, gift codes, timestamps, POS location
- **Key fields parsed:** `Card Number`, `ETickets Redeemed`, `Gift code`, `Redeemed date`

#### 3. Master Audit Report (Standard Semnox Export)
- **Source:** Semnox Web Portal → Reports → System
- **Contains:** System configuration changes, machine updates
- **Key fields parsed:** `TableName`, `KeyValue`, `FieldName`, `NewValue`, `OldValue`

#### 4. Combined Dashboard Report (Custom SQL Export)
- **Source:** Custom SQL query run via Semnox web portal
- **Contains:** Both transactions AND redemptions in one file
- **Required columns:** `record_type`, `card_number`, `timestamp`, `tickets_earned`, etc.

### SQL Query for Combined Report

```sql
SELECT 
    'TRANSACTION' AS record_type,
    c.card_number,
    ISNULL(cu.customer_name, 'Guest') AS customer_name,
    t.trx_date AS timestamp,
    g.game_name,
    m.machine_name,
    t.credits AS credits_spent,
    t.tickets AS tickets_earned,
    c.ticket_count AS current_ticket_balance,
    c.credits_balance AS current_credits_balance,
    NULL AS redemption_id,
    NULL AS gift_code,
    NULL AS pos_name
FROM trx t
    JOIN cards c ON t.card_id = c.card_id
    LEFT JOIN customers cu ON c.customer_id = cu.customer_id
    LEFT JOIN games g ON t.game_id = g.game_id
    LEFT JOIN machines m ON t.machine_id = m.machine_id
WHERE t.trx_date BETWEEN @fromDate AND @toDate
    AND (t.site_id IN @SiteId OR -1 IN @SiteId)

UNION ALL

SELECT 
    'REDEMPTION' AS record_type,
    c.card_number,
    ISNULL(cu.customer_name, 'Guest') AS customer_name,
    r.redemption_date AS timestamp,
    NULL AS game_name,
    NULL AS machine_name,
    NULL AS credits_spent,
    r.tickets AS tickets_earned,
    c.ticket_count AS current_ticket_balance,
    c.credits_balance AS current_credits_balance,
    CONVERT(varchar, r.redemption_id) AS redemption_id,
    r.gift_code,
    p.pos_name
FROM redemptions r
    JOIN cards c ON r.card_id = c.card_id
    LEFT JOIN customers cu ON c.customer_id = cu.customer_id
    LEFT JOIN pos p ON r.pos_id = p.pos_id
WHERE r.redemption_date BETWEEN @fromDate AND @toDate
    AND (r.site_id IN @SiteId OR -1 IN @SiteId)

ORDER BY timestamp DESC
```

---

## ⚙️ Configuration

### Alert Thresholds (Hardcoded in Components)

| Threshold | Value | Location |
|-----------|-------|----------|
| High avg tickets/play (warning) | 50 | `Sidebar.tsx`, `fraud-detection/page.tsx` |
| High avg tickets/play (critical) | 100 | `fraud-detection/page.tsx` |
| High redemption volume (warning) | 2,000 tickets | `Sidebar.tsx`, `fraud-detection/page.tsx` |
| High redemption volume (critical) | 5,000 tickets | `fraud-detection/page.tsx` |

### Environment Variables (.env.example)

```env
# For future API integration
NEXT_PUBLIC_SEMNOX_BASE_URL=https://your-semnox-server.com/api
SEMNOX_API_KEY=your-api-key-here

# Threshold overrides (not yet implemented)
NEXT_PUBLIC_TICKETS_PER_MIN_WARNING=50
NEXT_PUBLIC_TICKETS_PER_MIN_CRITICAL=100
```

---

## 🚀 Development

### Prerequisites
- Node.js 18+ (Node 20+ recommended)
- npm or yarn

### Setup
```bash
git clone https://github.com/dustindudley/semnox-parafait-dashboard.git
cd semnox-parafait-dashboard
npm install
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel
Push to GitHub and import in Vercel. No additional configuration needed.

---

## 🤖 Notes for AI Agents

### Key Patterns

1. **Data Flow:** CSV Upload → Parser (`lib/csv/parsers.ts`) → Store (`lib/csv/store.ts`) → Components read from store

2. **No Backend:** All data stored in browser localStorage. Each report type has its own storage key.

3. **Report Detection:** `detectReportType()` in `data-import/page.tsx` auto-detects CSV format by checking for specific strings or column headers.

4. **Aggregation Functions:** 
   - `aggregateRedemptionsByCard()` - Groups redemptions by card number
   - `aggregateGamePerformance()` - Calculates avg tickets/play per game
   - `aggregateCardVelocity()` - Calculates TPM from transaction records

5. **Dynamic Badges:** Sidebar reads from store on every navigation (`useEffect` with `pathname` dependency) to update alert counts.

### Common Modifications

| Task | Files to Modify |
|------|-----------------|
| Add new CSV report type | `lib/csv/parsers.ts`, `lib/csv/store.ts`, `data-import/page.tsx` |
| Change alert thresholds | `components/layout/Sidebar.tsx`, `fraud-detection/page.tsx` |
| Add new dashboard widget | Create in `components/dashboard/`, import in `page.tsx` |
| Modify chart colors | Update HSL values in component or `globals.css` |
| Add API integration | Implement in `lib/api/semnox.ts`, update pages to fetch |

### Semnox Database Schema (Reference)

Based on SQL queries, key tables include:
- `trx` / `transactions` - Game play records
- `cards` - Card information and balances
- `customers` - Customer profiles
- `games` - Game definitions
- `machines` - Machine/reader definitions
- `redemptions` - Prize redemption records
- `pos` - Point of sale terminals
- `DBAuditLog` - System audit trail

---

## 📄 License

MIT License - See LICENSE file for details.

---

## 📞 Support

For Semnox-specific questions, contact your Semnox representative.
For dashboard issues, open a GitHub issue.
