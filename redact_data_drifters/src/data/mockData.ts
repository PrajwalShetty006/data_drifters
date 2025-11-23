import { SalesForecast, CustomerSegment, RFMData, MetricCard } from '../types/dashboard';

// Your actual JSON data
export const forecastDataJSON = {
  "forecast": [
    { "date": "2011-12-10", "prediction": 62831.41091333326 },
    { "date": "2011-12-11", "prediction": 35275.00446 },
    { "date": "2011-12-12", "prediction": 58825.07867 },
    { "date": "2011-12-13", "prediction": 35415.477693333356 },
    { "date": "2011-12-14", "prediction": 55208.13413333332 },
    { "date": "2011-12-15", "prediction": 40945.76860000003 },
    { "date": "2011-12-16", "prediction": 52837.32320000005 },
    { "date": "2011-12-17", "prediction": 52501.64874666665 },
    { "date": "2011-12-18", "prediction": 51013.14680000003 },
    { "date": "2011-12-19", "prediction": 56658.210076666735 },
    { "date": "2011-12-20", "prediction": 57154.46517000003 },
    { "date": "2011-12-21", "prediction": 58558.3644333334 },
    { "date": "2011-12-22", "prediction": 66038.2982866666 },
    { "date": "2011-12-23", "prediction": 68710.7024833332 },
    { "date": "2011-12-24", "prediction": 69538.97578666653 },
    { "date": "2011-12-25", "prediction": 64761.3275633333 },
    { "date": "2011-12-26", "prediction": 63029.103299999944 },
    { "date": "2011-12-27", "prediction": 61141.6584933333 },
    { "date": "2011-12-28", "prediction": 62552.16276666659 },
    { "date": "2011-12-29", "prediction": 62029.73847666664 },
    { "date": "2011-12-30", "prediction": 61624.14205999998 },
    { "date": "2011-12-31", "prediction": 61750.73360333331 },
    { "date": "2012-01-01", "prediction": 62221.56197999998 },
    { "date": "2012-01-02", "prediction": 63665.667553333304 },
    { "date": "2012-01-03", "prediction": 63296.847093333265 },
    { "date": "2012-01-04", "prediction": 64137.757486666604 },
    { "date": "2012-01-05", "prediction": 63217.5413366666 },
    { "date": "2012-01-06", "prediction": 64652.7445733333 }
  ]
};

export const offersDataJSON = {
  "offers": {
    "Frequent Buyer": "Provide 5% discount on orders above $50 to boost repeat purchases.",
    "VIP Customer": "Offer 10% loyalty discount and early access to new arrivals.",
    "At Risk Customer": "Give 15% re-engagement discount with free shipping.",
    "New/Low Value Customer": "Give a 5% welcome discount on their next purchase."
  },
  "best_offer": "Provide 5% discount on orders above $50 to boost repeat purchases."
};

// Transform forecast data for charts
export const salesForecastData: SalesForecast[] = forecastDataJSON.forecast.map((item, index) => {
  const date = new Date(item.date);
  const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
  
  // For demonstration, we'll treat the first 20 as historical and last 8 as forecast
  const isHistorical = index < 20;
  
  return {
    week: formattedDate,
    actual: isHistorical ? item.prediction : 0,
    forecast: !isHistorical ? item.prediction : item.prediction,
    confidence_upper: item.prediction * 1.15,
    confidence_lower: item.prediction * 0.85,
  };
});

// Customer segments based on offers
export const customerSegments: CustomerSegment[] = [
  { segment: 'VIP Customer', count: 450, revenue: 450000, avgOrderValue: 1000, color: '#0ea5e9' },
  { segment: 'Frequent Buyer', count: 1200, revenue: 360000, avgOrderValue: 300, color: '#3b82f6' },
  { segment: 'At Risk Customer', count: 800, revenue: 120000, avgOrderValue: 150, color: '#f59e0b' },
  { segment: 'New/Low Value Customer', count: 600, revenue: 90000, avgOrderValue: 150, color: '#10b981' },
];

export const rfmData: RFMData[] = [
  { customerId: 'C001', recency: 2, frequency: 45, monetary: 12500, segment: 'VIP Customer' },
  { customerId: 'C002', recency: 5, frequency: 38, monetary: 9800, segment: 'VIP Customer' },
  { customerId: 'C003', recency: 3, frequency: 32, monetary: 8200, segment: 'Frequent Buyer' },
  { customerId: 'C004', recency: 45, frequency: 28, monetary: 7500, segment: 'At Risk Customer' },
  { customerId: 'C005', recency: 1, frequency: 5, monetary: 1200, segment: 'New/Low Value Customer' },
  { customerId: 'C006', recency: 120, frequency: 15, monetary: 4500, segment: 'At Risk Customer' },
  { customerId: 'C007', recency: 4, frequency: 42, monetary: 11200, segment: 'VIP Customer' },
  { customerId: 'C008', recency: 7, frequency: 35, monetary: 9200, segment: 'Frequent Buyer' },
  { customerId: 'C009', recency: 10, frequency: 30, monetary: 7800, segment: 'Frequent Buyer' },
  { customerId: 'C010', recency: 2, frequency: 8, monetary: 2100, segment: 'New/Low Value Customer' },
];

// Calculate metrics from actual data
const totalPredictions = forecastDataJSON.forecast.reduce((sum, item) => sum + item.prediction, 0);
const avgPrediction = totalPredictions / forecastDataJSON.forecast.length;
const lastWeekAvg = forecastDataJSON.forecast.slice(-7).reduce((sum, item) => sum + item.prediction, 0) / 7;
const firstWeekAvg = forecastDataJSON.forecast.slice(0, 7).reduce((sum, item) => sum + item.prediction, 0) / 7;
const growthRate = ((lastWeekAvg - firstWeekAvg) / firstWeekAvg) * 100;

export const metricCards: MetricCard[] = [
  {
    id: 'total-revenue',
    title: 'Avg Daily Sales',
    value: `$${(avgPrediction / 1000).toFixed(1)}k`,
    change: growthRate,
    icon: 'DollarSign',
    data: forecastDataJSON.forecast.slice(0, 8).map(f => f.prediction / 1000),
    order: 0,
  },
  {
    id: 'forecast-trend',
    title: 'Forecast Trend',
    value: growthRate > 0 ? 'Growing' : 'Declining',
    change: Math.abs(growthRate),
    icon: 'TrendingUp',
    data: forecastDataJSON.forecast.slice(8, 16).map(f => f.prediction / 1000),
    order: 1,
  },
  {
    id: 'customer-segments',
    title: 'Customer Groups',
    value: '4',
    change: 0,
    icon: 'Users',
    data: customerSegments.map(s => s.count / 100),
    order: 2,
  },
  {
    id: 'best-performers',
    title: 'VIP Customers',
    value: '450',
    change: 12.5,
    icon: 'Target',
    data: [4, 4.2, 4.3, 4.4, 4.5, 4.5, 4.5, 4.5],
    order: 3,
  },
  {
    id: 'peak-sales',
    title: 'Peak Sales Day',
    value: `$${(Math.max(...forecastDataJSON.forecast.map(f => f.prediction)) / 1000).toFixed(1)}k`,
    change: 8.5,
    icon: 'AlertTriangle',
    data: forecastDataJSON.forecast.slice(-8).map(f => f.prediction / 1000),
    order: 4,
  },
];

export const productPerformance = [
  { product: 'Electronics', sales: 285000, growth: 15.2 },
  { product: 'Clothing', sales: 198000, growth: 8.7 },
  { product: 'Home & Garden', sales: 165000, growth: 12.3 },
  { product: 'Sports', sales: 142000, growth: -2.1 },
  { product: 'Books', sales: 98000, growth: 5.6 },
];

export const regionalSales = [
  { region: 'North America', sales: 425000, customers: 1850 },
  { region: 'Europe', sales: 312000, customers: 1420 },
  { region: 'Asia', sales: 198000, customers: 980 },
  { region: 'South America', sales: 85000, customers: 450 },
];

// Transform offers data for display
export const targetedOffers = Object.entries(offersDataJSON.offers).map(([segment, offer], index) => {
  const priorities = ['High', 'High', 'High', 'Medium'];
  const revenues = [67500, 36000, 24000, 4500];
  
  return {
    segment,
    offer,
    priority: priorities[index] || 'Medium',
    estimatedRevenue: revenues[index] || 5000,
    isBestOffer: offer === offersDataJSON.best_offer,
  };
});

// Calculate summary statistics
export const summaryStats = {
  totalCustomers: customerSegments.reduce((sum, seg) => sum + seg.count, 0),
  totalRevenue: customerSegments.reduce((sum, seg) => sum + seg.revenue, 0),
  avgForecast: avgPrediction,
  forecastGrowth: growthRate,
  bestSegment: customerSegments.reduce((best, seg) => 
    seg.revenue > best.revenue ? seg : best
  ),
  projectedMonthlyIncrease: (lastWeekAvg - firstWeekAvg) * 4,
};
