// CSV Parsers for Semnox Parafait Reports
// Handles the unique key-value format used in Semnox export CSVs

export interface GameMetric {
  siteName: string;
  gameProfile: string;
  gameName: string;
  gameId: string;
  creditPlayCount: number;
  courtesyPlayCount: number;
  bonusPlayCount: number;
  timePlayCount: number;
  cardGameCount: number;
  totalPlays: number;
  creditsAmount: number;
  totalAmount: number;
  tickets: number;
  avgPrice: number;
  payoutPercent: number;
}

export interface RedemptionDetail {
  siteName: string;
  cashierName: string;
  posName: string;
  redeemedDate: Date;
  redemptionId: string;
  ticketEaterReceiptNumber: string;
  ticketsLoadedViaTicketEater: number;
  redemptionTicketReceiptNumber: string;
  ticketsLoadedViaRedemptionReceipt: number;
  redemptionCurrencyName: string;
  redemptionCurrencyValueInTickets: number;
  redemptionCurrencyQuantity: number;
  redemptionCurrencyTicketsLoaded: number;
  manualTicketsLoaded: number;
  cardNumber: string;
  eTicketsRedeemed: number;
  giftCode: string;
  giftTickets: number;
  totalTicketsLoaded: number;
  totalTicketsRedeemed: number;
  balanceTicketsLoadedToCard: number;
  ticketLoadedToCardNumber: string;
  balanceTicketsPrinted: number;
  printedReceiptNumber: string;
}

export interface AuditRecord {
  reportName: string;
  siteName: string;
  dateRange: string;
  tableName: string;
  keyValue: string;
  fieldName: string;
  newValue: string;
  oldValue: string;
  type: string;
  dateOfLog: Date;
  username: string;
}

// Parse the Semnox key-value CSV format
function parseKeyValueRow(headers: string[], values: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  
  for (let i = 0; i < headers.length && i < values.length; i += 2) {
    const key = headers[i];
    const valueKey = headers[i + 1];
    
    if (key && valueKey && values[i + 1] !== undefined) {
      // Use the label as the key and the next column as the value
      const cleanKey = values[i]?.trim() || key;
      const cleanValue = values[i + 1]?.trim() || '';
      result[cleanKey] = cleanValue;
    }
  }
  
  return result;
}

// Clean numeric strings (remove commas, handle empty)
function parseNumber(value: string | undefined): number {
  if (!value || value.trim() === '') return 0;
  const cleaned = value.replace(/,/g, '').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

// Parse date strings from Semnox format
function parseDate(dateStr: string | undefined): Date {
  if (!dateStr || dateStr.trim() === '') return new Date();
  
  // Handle formats like "11-Jan-2026 3:04 PM" or "Jan 30 2026  6:12PM"
  const cleaned = dateStr.trim();
  const parsed = new Date(cleaned);
  
  if (isNaN(parsed.getTime())) {
    // Try alternative parsing for "11-Jan-2026 3:04 PM" format
    const parts = cleaned.match(/(\d{1,2})-(\w{3})-(\d{4})\s+(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (parts) {
      const [, day, month, year, hour, minute, ampm] = parts;
      const monthMap: Record<string, number> = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
      };
      let hours = parseInt(hour);
      if (ampm?.toUpperCase() === 'PM' && hours !== 12) hours += 12;
      if (ampm?.toUpperCase() === 'AM' && hours === 12) hours = 0;
      
      return new Date(parseInt(year), monthMap[month] || 0, parseInt(day), hours, parseInt(minute));
    }
  }
  
  return parsed;
}

// Parse Game Metric Report CSV
export function parseGameMetricReport(csvContent: string): GameMetric[] {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',');
  const results: GameMetric[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    
    // Skip if this is a total/summary row
    if (values[0] !== 'Game Metric Report') continue;
    
    // Find the key data by looking for specific labels
    const dataMap: Record<string, string> = {};
    
    for (let j = 0; j < values.length - 1; j++) {
      const label = values[j]?.trim();
      const value = values[j + 1]?.trim();
      
      if (label && value !== undefined) {
        dataMap[label] = value;
      }
    }
    
    // Only add if we have valid game data (has a game name)
    const gameName = dataMap['Game Name'];
    if (!gameName || gameName === '') continue;
    
    results.push({
      siteName: dataMap['Site Name'] || values[1]?.replace('Site: ', '') || '',
      gameProfile: dataMap['Game Profiles'] || '',
      gameName: gameName,
      gameId: dataMap['ID'] || '',
      creditPlayCount: parseNumber(dataMap['Credit Play Count']),
      courtesyPlayCount: parseNumber(dataMap['Courtesy Play Count']),
      bonusPlayCount: parseNumber(dataMap['Bonus Play Count']),
      timePlayCount: parseNumber(dataMap['Time Play Count']),
      cardGameCount: parseNumber(dataMap['Card Game Count']),
      totalPlays: parseNumber(dataMap['Total Plays']),
      creditsAmount: parseNumber(dataMap['Credits']),
      totalAmount: parseNumber(dataMap['Total Amt.']),
      tickets: parseNumber(dataMap['Tickets']),
      avgPrice: parseNumber(dataMap['Avg. Price']),
      payoutPercent: parseNumber(dataMap['PO%']),
    });
  }
  
  return results;
}

// Parse Redemption Tickets Details Report CSV
export function parseRedemptionReport(csvContent: string): RedemptionDetail[] {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];
  
  const results: RedemptionDetail[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    
    if (values[0] !== 'Redemption Tickets Details Report') continue;
    
    // Build a map from the key-value pairs
    const dataMap: Record<string, string> = {};
    
    for (let j = 0; j < values.length - 1; j++) {
      const label = values[j]?.trim();
      const value = values[j + 1]?.trim();
      
      if (label && value !== undefined) {
        dataMap[label] = value;
      }
    }
    
    results.push({
      siteName: dataMap['Site name'] || '',
      cashierName: dataMap['Cashier Name'] || '',
      posName: dataMap['POSName'] || '',
      redeemedDate: parseDate(dataMap['Redeemed date']),
      redemptionId: dataMap['Redemption id'] || '',
      ticketEaterReceiptNumber: dataMap['Ticket Eater Receipt Number'] || '',
      ticketsLoadedViaTicketEater: parseNumber(dataMap['Tickets Loaded Via Ticket Eater']),
      redemptionTicketReceiptNumber: dataMap['Redemption Ticket Receipt Number'] || '',
      ticketsLoadedViaRedemptionReceipt: parseNumber(dataMap['Tickets Loaded Via Redemption Receipt']),
      redemptionCurrencyName: dataMap['Redemption Currency Name'] || '',
      redemptionCurrencyValueInTickets: parseNumber(dataMap['Redemption Currency Value In Tickets']),
      redemptionCurrencyQuantity: parseNumber(dataMap['Redemption Currency Quantity']),
      redemptionCurrencyTicketsLoaded: parseNumber(dataMap['Redemption Currency Tickets Loaded']),
      manualTicketsLoaded: parseNumber(dataMap['Manual tickets loaded']),
      cardNumber: dataMap['Card Number'] || '',
      eTicketsRedeemed: parseNumber(dataMap['ETickets Redeemed']),
      giftCode: dataMap['Gift code'] || '',
      giftTickets: parseNumber(dataMap['Gift Tickets']),
      totalTicketsLoaded: parseNumber(dataMap['Total Tickets Loaded']),
      totalTicketsRedeemed: parseNumber(dataMap['Total Tickets Redeemed']),
      balanceTicketsLoadedToCard: parseNumber(dataMap['Balance Tickets Loaded to Card']),
      ticketLoadedToCardNumber: dataMap['Ticket Loaded To Card number'] || '',
      balanceTicketsPrinted: parseNumber(dataMap['Balance Tickets Printed']),
      printedReceiptNumber: dataMap['Printed Receipt Number'] || '',
    });
  }
  
  return results;
}

// Parse Master Audit Report CSV
export function parseAuditReport(csvContent: string): AuditRecord[] {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];
  
  const results: AuditRecord[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    
    if (values[0] !== 'Master Audit Report') continue;
    
    const dataMap: Record<string, string> = {};
    
    for (let j = 0; j < values.length - 1; j++) {
      const label = values[j]?.trim();
      const value = values[j + 1]?.trim();
      
      if (label && value !== undefined) {
        dataMap[label] = value;
      }
    }
    
    results.push({
      reportName: values[0] || '',
      siteName: values[1]?.replace('Site: ', '') || '',
      dateRange: values[2] || '',
      tableName: dataMap['TableName'] || '',
      keyValue: dataMap['KeyValue'] || '',
      fieldName: dataMap['FieldName'] || '',
      newValue: dataMap['NewValue'] || '',
      oldValue: dataMap['OldValue'] || '',
      type: dataMap['Type'] || '',
      dateOfLog: parseDate(dataMap['DateOfLog']),
      username: dataMap['Username'] || '',
    });
  }
  
  return results;
}

// Helper function to properly parse CSV lines (handles quoted fields)
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}

// Aggregate redemption data by card number
export interface CardRedemptionSummary {
  cardNumber: string;
  totalTicketsRedeemed: number;
  totalTransactions: number;
  lastRedemption: Date;
  giftCodes: string[];
}

export function aggregateRedemptionsByCard(redemptions: RedemptionDetail[]): CardRedemptionSummary[] {
  const cardMap = new Map<string, CardRedemptionSummary>();
  
  for (const r of redemptions) {
    if (!r.cardNumber) continue;
    
    const existing = cardMap.get(r.cardNumber);
    
    if (existing) {
      existing.totalTicketsRedeemed += r.eTicketsRedeemed + r.totalTicketsLoaded;
      existing.totalTransactions += 1;
      if (r.redeemedDate > existing.lastRedemption) {
        existing.lastRedemption = r.redeemedDate;
      }
      if (r.giftCode && !existing.giftCodes.includes(r.giftCode)) {
        existing.giftCodes.push(r.giftCode);
      }
    } else {
      cardMap.set(r.cardNumber, {
        cardNumber: r.cardNumber,
        totalTicketsRedeemed: r.eTicketsRedeemed + r.totalTicketsLoaded,
        totalTransactions: 1,
        lastRedemption: r.redeemedDate,
        giftCodes: r.giftCode ? [r.giftCode] : [],
      });
    }
  }
  
  return Array.from(cardMap.values()).sort((a, b) => b.totalTicketsRedeemed - a.totalTicketsRedeemed);
}

// Aggregate game metrics for visualization
export interface GamePerformanceSummary {
  gameName: string;
  gameProfile: string;
  totalPlays: number;
  totalTickets: number;
  totalRevenue: number;
  avgTicketsPerPlay: number;
  payoutPercent: number;
}

export function aggregateGamePerformance(games: GameMetric[]): GamePerformanceSummary[] {
  return games
    .filter(g => g.totalPlays > 0)
    .map(g => ({
      gameName: g.gameName,
      gameProfile: g.gameProfile,
      totalPlays: g.totalPlays,
      totalTickets: g.tickets,
      totalRevenue: g.totalAmount,
      avgTicketsPerPlay: g.totalPlays > 0 ? g.tickets / g.totalPlays : 0,
      payoutPercent: g.payoutPercent,
    }))
    .sort((a, b) => b.totalTickets - a.totalTickets);
}

