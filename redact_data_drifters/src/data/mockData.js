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
export const salesForecastData = forecastDataJSON.forecast.map((item, index) => {
  const date = new Date(item.date);
  const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
  
  // For demonstration, we'll treat the first 20 as historical and last 8 as forecast
  const isHistorical = index < 20;
  
  return {
    week: formattedDate,
    date: item.date,
    dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' }),
    actual: isHistorical ? item.prediction : 0,
    forecast: !isHistorical ? item.prediction : item.prediction,
    confidence_upper: item.prediction * 1.15,
    confidence_lower: item.prediction * 0.85,
  };
});

// Customer segments based on offers
export const customerSegments = [
  { segment: 'VIP Customer', name: 'VIP', count: 450, revenue: 450000, avgOrderValue: 1000, color: '#0ea5e9' },
  { segment: 'Frequent Buyer', name: 'Frequent', count: 1200, revenue: 360000, avgOrderValue: 300, color: '#3b82f6' },
  { segment: 'At Risk Customer', name: 'At Risk', count: 800, revenue: 120000, avgOrderValue: 150, color: '#f59e0b' },
  { segment: 'New/Low Value Customer', name: 'New/Low', count: 600, revenue: 90000, avgOrderValue: 150, color: '#10b981' },
];

export const rfmData = [
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
  { customerId: 'C011', recency: 3, frequency: 40, monetary: 10500, segment: 'VIP Customer' },
  { customerId: 'C012', recency: 6, frequency: 33, monetary: 8900, segment: 'Frequent Buyer' },
  { customerId: 'C013', recency: 50, frequency: 25, monetary: 7000, segment: 'At Risk Customer' },
  { customerId: 'C014', recency: 1, frequency: 6, monetary: 1500, segment: 'New/Low Value Customer' },
  { customerId: 'C015', recency: 100, frequency: 18, monetary: 5200, segment: 'At Risk Customer' },
  { customerId: 'C016', recency: 5, frequency: 44, monetary: 11800, segment: 'VIP Customer' },
  { customerId: 'C017', recency: 8, frequency: 36, monetary: 9500, segment: 'Frequent Buyer' },
  { customerId: 'C018', recency: 11, frequency: 31, monetary: 8100, segment: 'Frequent Buyer' },
  { customerId: 'C019', recency: 2, frequency: 9, monetary: 2300, segment: 'New/Low Value Customer' },
  { customerId: 'C020', recency: 4, frequency: 43, monetary: 11500, segment: 'VIP Customer' },
  { customerId: 'C021', recency: 7, frequency: 37, monetary: 9700, segment: 'Frequent Buyer' },
  { customerId: 'C022', recency: 55, frequency: 27, monetary: 7200, segment: 'At Risk Customer' },
  { customerId: 'C023', recency: 1, frequency: 7, monetary: 1800, segment: 'New/Low Value Customer' },
  { customerId: 'C024', recency: 110, frequency: 16, monetary: 4800, segment: 'At Risk Customer' },
  { customerId: 'C025', recency: 6, frequency: 41, monetary: 10800, segment: 'VIP Customer' },
  { customerId: 'C026', recency: 9, frequency: 34, monetary: 8800, segment: 'Frequent Buyer' },
  { customerId: 'C027', recency: 12, frequency: 29, monetary: 7600, segment: 'Frequent Buyer' },
  { customerId: 'C028', recency: 3, frequency: 10, monetary: 2500, segment: 'New/Low Value Customer' },
  { customerId: 'C029', recency: 5, frequency: 39, monetary: 10200, segment: 'VIP Customer' },
  { customerId: 'C030', recency: 8, frequency: 35, monetary: 9300, segment: 'Frequent Buyer' },
  { customerId: 'C031', recency: 60, frequency: 26, monetary: 7100, segment: 'At Risk Customer' },
  { customerId: 'C032', recency: 2, frequency: 8, monetary: 2000, segment: 'New/Low Value Customer' },
  { customerId: 'C033', recency: 115, frequency: 17, monetary: 5000, segment: 'At Risk Customer' },
  { customerId: 'C034', recency: 4, frequency: 42, monetary: 11000, segment: 'VIP Customer' },
  { customerId: 'C035', recency: 7, frequency: 36, monetary: 9400, segment: 'Frequent Buyer' },
  { customerId: 'C036', recency: 10, frequency: 32, monetary: 8300, segment: 'Frequent Buyer' },
  { customerId: 'C037', recency: 1, frequency: 9, monetary: 2200, segment: 'New/Low Value Customer' },
  { customerId: 'C038', recency: 3, frequency: 44, monetary: 11600, segment: 'VIP Customer' },
  { customerId: 'C039', recency: 6, frequency: 38, monetary: 9900, segment: 'Frequent Buyer' },
  { customerId: 'C040', recency: 52, frequency: 28, monetary: 7400, segment: 'At Risk Customer' },
  { customerId: 'C041', recency: 2, frequency: 7, monetary: 1700, segment: 'New/Low Value Customer' },
  { customerId: 'C042', recency: 105, frequency: 19, monetary: 5400, segment: 'At Risk Customer' },
  { customerId: 'C043', recency: 5, frequency: 40, monetary: 10600, segment: 'VIP Customer' },
  { customerId: 'C044', recency: 8, frequency: 33, monetary: 8600, segment: 'Frequent Buyer' },
  { customerId: 'C045', recency: 11, frequency: 30, monetary: 7900, segment: 'Frequent Buyer' },
  { customerId: 'C046', recency: 3, frequency: 10, monetary: 2400, segment: 'New/Low Value Customer' },
  { customerId: 'C047', recency: 4, frequency: 41, monetary: 10900, segment: 'VIP Customer' },
  { customerId: 'C048', recency: 9, frequency: 35, monetary: 9100, segment: 'Frequent Buyer' },
  { customerId: 'C049', recency: 58, frequency: 29, monetary: 7700, segment: 'At Risk Customer' },
  { customerId: 'C050', recency: 1, frequency: 6, monetary: 1400, segment: 'New/Low Value Customer' },
];

// Calculate metrics from actual data
const totalPredictions = forecastDataJSON.forecast.reduce((sum, item) => sum + item.prediction, 0);
const avgPrediction = totalPredictions / forecastDataJSON.forecast.length;
const lastWeekAvg = forecastDataJSON.forecast.slice(-7).reduce((sum, item) => sum + item.prediction, 0) / 7;
const firstWeekAvg = forecastDataJSON.forecast.slice(0, 7).reduce((sum, item) => sum + item.prediction, 0) / 7;
const growthRate = ((lastWeekAvg - firstWeekAvg) / firstWeekAvg) * 100;

export const metricCards = [
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
  const discounts = [10, 5, 15, 5];
  
  return {
    segment,
    offer,
    offerType: 'Discount',
    priority: priorities[index] || 'Medium',
    estimatedRevenue: revenues[index] || 5000,
    expectedRevenue: revenues[index] || 5000,
    discount: discounts[index] || 5,
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
