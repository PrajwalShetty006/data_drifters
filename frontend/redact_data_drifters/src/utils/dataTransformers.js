// Transform API responses to match dashboard data format

/**
 * Transform forecast API response to chart format
 * @param {Array} forecastData - Array of {date, prediction}
 * @returns {Array} Transformed data for SalesForecastChart
 */
export const transformForecastData = (forecastData) => {
  if (!forecastData || !Array.isArray(forecastData)) {
    return [];
  }

  return forecastData.map((item, index) => {
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
};

/**
 * Transform RFM API response to customer segments format
 * @param {Object} rfmData - {rfm_table, segment_summary, top_segment}
 * @returns {Array} Transformed data for CustomerSegmentChart
 */
export const transformRFMData = (rfmData) => {
  if (!rfmData || !rfmData.segment_summary) {
    return [];
  }

  // Color mapping for segments
  const colorMap = {
    'VIP Customer': '#0ea5e9',
    'Frequent Buyer': '#3b82f6',
    'At Risk Customer': '#f59e0b',
    'New/Low Value Customer': '#10b981',
  };

  // Calculate revenue from RFM table if available
  const rfmTable = rfmData.rfm_table || [];
  const segmentRevenue = {};
  
  if (rfmTable.length > 0) {
    rfmTable.forEach((record) => {
      const segment = record.Segment || record.segment;
      if (!segmentRevenue[segment]) {
        segmentRevenue[segment] = 0;
      }
      segmentRevenue[segment] += record.Monetary || record.monetary || 0;
    });
  }

  // Transform segment summary to chart format
  return Object.entries(rfmData.segment_summary).map(([segment, count]) => {
    // Use actual revenue from RFM table if available, otherwise calculate from monetary values
    const revenue = segmentRevenue[segment] || 0;
    const avgOrderValue = (count > 0 && revenue > 0) ? revenue / count : 0;
    
    return {
      segment,
      count: typeof count === 'number' ? count : parseInt(count) || 0,
      revenue: revenue,
      avgOrderValue: avgOrderValue,
      color: colorMap[segment] || '#60a5fa',
    };
  });
};

/**
 * Transform discounts API response to targeted offers format
 * @param {Object} discountsData - {offers, best_offer}
 * @param {Object} rfmData - RFM data for revenue calculation
 * @returns {Array} Transformed data for TargetedOffersPanel
 */
export const transformDiscountsData = (discountsData, rfmData = null) => {
  if (!discountsData || !discountsData.offers) {
    return [];
  }

  const offers = discountsData.offers || {};
  const bestOffer = discountsData.best_offer || '';
  
  // Get segment summary from RFM if available
  const segmentSummary = rfmData?.segment_summary || {};
  
  // Priority mapping
  const priorityMap = {
    'VIP Customer': 'High',
    'Frequent Buyer': 'Medium',
    'At Risk Customer': 'High',
    'New/Low Value Customer': 'Medium',
  };

  return Object.entries(offers).map(([segment, offer]) => {
    const count = segmentSummary[segment] || 0;
    // Get segment revenue from RFM data if available
    const segmentData = rfmData?.segment_summary ? {} : {};
    // Calculate revenue from segment if we have RFM data
    let segmentRevenue = 0;
    if (rfmData?.rfm_table && Array.isArray(rfmData.rfm_table)) {
      const segmentCustomers = rfmData.rfm_table.filter(c => c.Segment === segment || c.segment === segment);
      segmentRevenue = segmentCustomers.reduce((sum, c) => sum + (c.Monetary || c.monetary || 0), 0);
    }
    // Estimate revenue based on segment revenue and discount percentage
    const discountMatch = offer.match(/(\d+)%/);
    const discountPercent = discountMatch ? parseInt(discountMatch[1]) : 5;
    const estimatedRevenue = segmentRevenue > 0 
      ? segmentRevenue * (discountPercent / 100)
      : 0; // Only calculate if we have actual revenue data
    
    return {
      segment,
      offer: typeof offer === 'string' ? offer : String(offer),
      priority: priorityMap[segment] || 'Medium',
      estimatedRevenue: estimatedRevenue,
      isBestOffer: offer === bestOffer || segment === discountsData.best_offer_segment,
    };
  });
};

/**
 * Transform forecast data for metric cards
 * @param {Array} forecastData - Array of {date, prediction}
 * @returns {Object} Metrics for dashboard cards
 */
export const calculateMetricsFromForecast = (forecastData) => {
  if (!forecastData || !Array.isArray(forecastData) || forecastData.length === 0) {
    return {
      totalRevenue: 0,
      avgDailySales: 0,
      growthRate: 0,
      totalCustomers: 0,
    };
  }

  const predictions = forecastData.map(f => f.prediction || 0);
  const totalPredictions = predictions.reduce((sum, val) => sum + val, 0);
  const avgPrediction = totalPredictions / predictions.length;
  const lastWeekAvg = predictions.slice(-7).reduce((sum, val) => sum + val, 0) / 7;
  const firstWeekAvg = predictions.slice(0, 7).reduce((sum, val) => sum + val, 0) / 7;
  const growthRate = firstWeekAvg > 0 ? ((lastWeekAvg - firstWeekAvg) / firstWeekAvg) * 100 : 0;

  return {
    totalRevenue: totalPredictions,
    avgDailySales: avgPrediction,
    growthRate: growthRate,
    totalCustomers: Math.floor(avgPrediction / 100), // Rough estimate
  };
};

/**
 * Transform run-all response to all data formats
 * @param {Object} runAllData - {forecast, rfm, discounts}
 * @returns {Object} All transformed data
 */
export const transformRunAllData = (runAllData) => {
  if (!runAllData) {
    return {
      forecast: [],
      segments: [],
      offers: [],
      metrics: {},
    };
  }

  const forecast = transformForecastData(runAllData.forecast || []);
  const segments = transformRFMData(runAllData.rfm || {});
  const offers = transformDiscountsData(runAllData.discounts || {}, runAllData.rfm);
  const metrics = calculateMetricsFromForecast(runAllData.forecast || []);

  return {
    forecast,
    segments,
    offers,
    metrics,
  };
};

