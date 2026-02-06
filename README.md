# Semnox Parafait Analytics Dashboard

A professional-grade analytics dashboard for monitoring ticket earnings, detecting potential system exploits, and tracking redemptions in real-time. Built with Next.js 15, TypeScript, Tailwind CSS, and Shadcn/UI.

![Dashboard Preview](./docs/preview.png)

## Features

### Core Dashboard Views

- **High-Earner Leaderboard**: Real-time table showing Card IDs with highest ticket balances and recent earnings
- **Velocity Monitor**: Scatter plot visualization of ticket acquisition rates (Tickets per Minute) with anomaly highlighting
- **Redemption Feed**: Live-updating list of recently redeemed prizes with ticket values and locations

### Fraud Detection

- **Warning Badges**: Automatic yellow/red alerts for cards earning above threshold rates
- **Configurable Thresholds**: Customizable TPM (Tickets Per Minute) and balance thresholds via environment variables
- **Investigation Tools**: Quick-action buttons for blocking cards or marking alerts as resolved

### UI/UX

- **Dark Mode Fintech Aesthetic**: Professional, modern design optimized for monitoring applications
- **Responsive Layout**: Works seamlessly on desktop and tablet devices
- **Real-time Updates**: Built-in refresh capabilities with live data indicators

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: Shadcn/UI
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 20.9.0 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd semnox-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_SEMNOX_BASE_URL` | Base URL for Semnox REST API | `http://localhost:3000/api` |
| `SEMNOX_API_KEY` | API authentication key | - |
| `DATABASE_URL` | SQL Server connection string (optional) | - |
| `NEXT_PUBLIC_TICKETS_PER_MIN_WARNING` | TPM threshold for warning alerts | `50` |
| `NEXT_PUBLIC_TICKETS_PER_MIN_CRITICAL` | TPM threshold for critical alerts | `100` |
| `NEXT_PUBLIC_HIGH_BALANCE_WARNING` | Ticket balance warning threshold | `5000` |
| `NEXT_PUBLIC_HIGH_BALANCE_CRITICAL` | Ticket balance critical threshold | `15000` |
| `NEXT_PUBLIC_ENABLE_REAL_TIME` | Enable real-time data fetching | `false` |
| `NEXT_PUBLIC_REFRESH_INTERVAL_MS` | Data refresh interval in ms | `30000` |

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Overview dashboard
│   ├── fraud-detection/
│   │   └── page.tsx                # Fraud detection page
│   ├── redemption-logs/
│   │   └── page.tsx                # Redemption history page
│   ├── layout.tsx                  # Root layout with sidebar
│   └── globals.css                 # Global styles & theme
├── components/
│   ├── dashboard/
│   │   ├── StatsCards.tsx          # KPI summary cards
│   │   ├── HighEarnerLeaderboard.tsx
│   │   ├── VelocityMonitor.tsx     # TPM scatter plot
│   │   └── RedemptionFeed.tsx      # Live redemption feed
│   ├── layout/
│   │   └── Sidebar.tsx             # Navigation sidebar
│   └── ui/                         # Shadcn/UI components
├── lib/
│   ├── api/
│   │   ├── config.ts               # API configuration
│   │   └── semnox.ts               # Semnox API client
│   ├── mockData.ts                 # Mock data for development
│   └── utils.ts                    # Utility functions
```

## API Integration

The dashboard is currently using mock data for demonstration. To connect to real Semnox APIs:

1. Update `.env.local` with your Semnox API credentials
2. Set `USE_MOCK_DATA = false` in `src/lib/api/semnox.ts`
3. The API client is pre-configured with endpoints for:
   - Card data: `/cards`
   - Transactions: `/transactions`
   - Redemptions: `/redemptions`
   - Alerts: `/alerts`

## Deployment

### Vercel (Recommended)

1. Push your code to a Git repository
2. Import the project in Vercel
3. Add environment variables in project settings
4. Deploy

### Other Platforms

```bash
npm run build
npm start
```

## Alert Thresholds

| Metric | Warning | Critical |
|--------|---------|----------|
| Tickets per Minute | ≥50 TPM | ≥100 TPM |
| Ticket Balance | ≥5,000 | ≥15,000 |

These thresholds can be customized via environment variables to match your venue's typical gameplay patterns.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.

---

Built for Semnox Parafait systems. For support, contact your Semnox representative.
