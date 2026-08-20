export interface MarketPulseMetric {
  value: string
  label: string
  delta: string
}

// Editorial market-research figures, manually curated -- not derived from
// live job data. See the "Updated" caption in MarketPulse.tsx for the as-of
// date; bump both together when these are refreshed.
export const MARKET_PULSE_METRICS: MarketPulseMetric[] = [
  { value: '34,200', label: 'MW Under Construction', delta: '+18.4% YoY' },
  { value: '104 wks', label: 'Transformer Lead Time', delta: '+12 wks QoQ' },
  { value: '$312B', label: 'Hyperscaler Capex 2026E', delta: '2026E' },
  { value: '2,847', label: 'Active US Projects', delta: '+47 this week' },
]

export const MARKET_PULSE_UPDATED = 'Updated August 2026'
