// Dashboard Types
export interface SalesForecast {
  week: string;
  actual: number;
  forecast: number;
  confidence_upper: number;
  confidence_lower: number;
}

export interface CustomerSegment {
  segment: string;
  count: number;
  revenue: number;
  avgOrderValue: number;
  color: string;
}

export interface RFMData {
  customerId: string;
  recency: number;
  frequency: number;
  monetary: number;
  segment: string;
}

export interface MetricCard {
  id: string;
  title: string;
  value: string;
  change: number;
  icon: string;
  data: number[];
  order: number;
}

export interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  order: number;
  visible: boolean;
}
