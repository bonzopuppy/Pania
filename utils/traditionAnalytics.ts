import { JournalEntry } from '@/services/journal';

export type Tradition = 'stoicism' | 'christianity' | 'buddhism' | 'sufism' | 'taoism' | 'judaism';

// All supported traditions
export const ALL_TRADITIONS: Tradition[] = [
  'stoicism',
  'christianity',
  'buddhism',
  'sufism',
  'taoism',
  'judaism',
];

// Tradition display names
export const TRADITION_NAMES: Record<Tradition, string> = {
  stoicism: 'Stoicism',
  christianity: 'Christianity',
  buddhism: 'Buddhism',
  sufism: 'Sufism',
  taoism: 'Taoism',
  judaism: 'Judaism',
};

// Gradient colors for tradition dots (from Figma design)
export const TRADITION_GRADIENTS: Record<Tradition, [string, string]> = {
  stoicism: ['#5B7C8D', '#8BA9B8'], // Blueish
  christianity: ['#8B5A5A', '#B88A8A'], // Reddish
  buddhism: ['#F6C555', '#FBE251'], // Gold
  sufism: ['#6A4C9C', '#8F77B5'], // Purple
  taoism: ['#00AA90', '#66BAB7'], // Teal
  judaism: ['#6B6B8B', '#9A9AB8'], // Blue-purple
};

/**
 * Get count of entries per tradition
 */
export function getTraditionCounts(entries: JournalEntry[]): Record<Tradition, number> {
  const counts: Record<Tradition, number> = {
    stoicism: 0,
    christianity: 0,
    buddhism: 0,
    sufism: 0,
    taoism: 0,
    judaism: 0,
  };

  entries.forEach((entry) => {
    if (entry.tradition && entry.tradition in counts) {
      counts[entry.tradition as Tradition]++;
    }
  });

  return counts;
}

/**
 * Get count of entries per tradition within a date range
 */
export function getTraditionCountsByTimeRange(
  entries: JournalEntry[],
  startDate: Date,
  endDate: Date
): Record<Tradition, number> {
  const filteredEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.created_at);
    return entryDate >= startDate && entryDate <= endDate;
  });

  return getTraditionCounts(filteredEntries);
}

/**
 * Get the most engaged tradition (highest count)
 */
export function getMostEngagedTradition(entries: JournalEntry[]): Tradition | null {
  const counts = getTraditionCounts(entries);

  let maxTradition: Tradition | null = null;
  let maxCount = 0;

  (Object.keys(counts) as Tradition[]).forEach((tradition) => {
    if (counts[tradition] > maxCount) {
      maxCount = counts[tradition];
      maxTradition = tradition;
    }
  });

  return maxTradition;
}

/**
 * Get total count of all entries with traditions
 */
export function getTotalVoicesCount(entries: JournalEntry[]): number {
  return entries.filter((entry) => !!entry.tradition).length;
}

/**
 * Get traditions sorted by count (descending)
 */
export function getTraditionsSortedByCount(
  entries: JournalEntry[]
): Array<{ tradition: Tradition; count: number }> {
  const counts = getTraditionCounts(entries);

  return (Object.keys(counts) as Tradition[])
    .map((tradition) => ({
      tradition,
      count: counts[tradition],
    }))
    .sort((a, b) => b.count - a.count);
}
