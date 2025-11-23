import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import { transformForecastData, transformRFMData, transformDiscountsData, transformRunAllData, calculateMetricsFromForecast } from '../utils/dataTransformers';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [forecastData, setForecastData] = useState(null);
  const [rfmData, setRfmData] = useState(null);
  const [discountsData, setDiscountsData] = useState(null);
  const [runAllData, setRunAllData] = useState(null);
  const [explainData, setExplainData] = useState(null);
  const [loading, setLoading] = useState({
    forecast: false,
    rfm: false,
    discounts: false,
    runAll: false,
    explain: false,
  });
  const [error, setError] = useState({
    forecast: null,
    rfm: null,
    discounts: null,
    runAll: null,
    explain: null,
  });

  // Fetch forecast data
  const fetchForecast = useCallback(async () => {
    setLoading(prev => ({ ...prev, forecast: true }));
    setError(prev => ({ ...prev, forecast: null }));
    try {
      const data = await apiService.getForecast();
      setForecastData(data);
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch forecast data';
      setError(prev => ({ ...prev, forecast: errorMsg }));
      console.error('Error fetching forecast:', err);
      return null;
    } finally {
      setLoading(prev => ({ ...prev, forecast: false }));
    }
  }, []);

  // Fetch RFM data
  const fetchRFM = useCallback(async () => {
    setLoading(prev => ({ ...prev, rfm: true }));
    setError(prev => ({ ...prev, rfm: null }));
    try {
      const data = await apiService.getRFM();
      setRfmData(data);
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch RFM data';
      setError(prev => ({ ...prev, rfm: errorMsg }));
      console.error('Error fetching RFM:', err);
      return null;
    } finally {
      setLoading(prev => ({ ...prev, rfm: false }));
    }
  }, []);

  // Fetch discounts data
  const fetchDiscounts = useCallback(async () => {
    setLoading(prev => ({ ...prev, discounts: true }));
    setError(prev => ({ ...prev, discounts: null }));
    try {
      const data = await apiService.getDiscounts();
      setDiscountsData(data);
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch discounts data';
      setError(prev => ({ ...prev, discounts: errorMsg }));
      console.error('Error fetching discounts:', err);
      return null;
    } finally {
      setLoading(prev => ({ ...prev, discounts: false }));
    }
  }, []);

  // Fetch run-all data (forecast + rfm + discounts)
  const fetchRunAll = useCallback(async () => {
    setLoading(prev => ({ ...prev, runAll: true }));
    setError(prev => ({ ...prev, runAll: null }));
    try {
      const data = await apiService.runAll();
      setRunAllData(data);
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch run-all data';
      setError(prev => ({ ...prev, runAll: errorMsg }));
      console.error('Error fetching run-all:', err);
      
      // If connection refused, show helpful message
      if (err.code === 'ERR_NETWORK' || err.message.includes('ECONNREFUSED')) {
        console.warn('⚠️ Backend server is not running! Please start the backend server on port 5000.');
        setError(prev => ({ ...prev, runAll: 'Backend server not running. Please start the backend server (port 5000) and ML server (port 8000).' }));
      }
      
      return null;
    } finally {
      setLoading(prev => ({ ...prev, runAll: false }));
    }
  }, []);

  // Fetch explain forecast data
  const fetchExplainForecast = useCallback(async () => {
    setLoading(prev => ({ ...prev, explain: true }));
    setError(prev => ({ ...prev, explain: null }));
    try {
      const data = await apiService.explainForecast();
      setExplainData(data);
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch explain forecast data';
      setError(prev => ({ ...prev, explain: errorMsg }));
      console.error('Error fetching explain forecast:', err);
      return null;
    } finally {
      setLoading(prev => ({ ...prev, explain: false }));
    }
  }, []);

  // Get transformed data for components
  const getTransformedForecast = useCallback(() => {
    if (runAllData?.forecast) {
      return transformForecastData(runAllData.forecast);
    }
    if (forecastData?.forecast) {
      return transformForecastData(forecastData.forecast);
    }
    return [];
  }, [forecastData, runAllData]);

  const getTransformedSegments = useCallback(() => {
    const rfm = runAllData?.rfm || rfmData;
    if (rfm) {
      return transformRFMData(rfm);
    }
    return [];
  }, [rfmData, runAllData]);

  const getTransformedOffers = useCallback(() => {
    const discounts = runAllData?.discounts || discountsData;
    const rfm = runAllData?.rfm || rfmData;
    if (discounts) {
      return transformDiscountsData(discounts, rfm);
    }
    return [];
  }, [discountsData, rfmData, runAllData]);

  const getMetrics = useCallback(() => {
    const forecast = runAllData?.forecast || forecastData?.forecast;
    if (forecast) {
      return calculateMetricsFromForecast(forecast);
    }
    return {
      totalRevenue: 0,
      avgDailySales: 0,
      growthRate: 0,
      totalCustomers: 0,
    };
  }, [forecastData, runAllData]);

  // Load initial data when dashboard mounts
  useEffect(() => {
    // Fetch run-all on mount to get all data at once
    fetchRunAll();
  }, [fetchRunAll]);

  const value = {
    // Raw data
    forecastData,
    rfmData,
    discountsData,
    runAllData,
    explainData,
    
    // Transformed data
    transformedForecast: getTransformedForecast(),
    transformedSegments: getTransformedSegments(),
    transformedOffers: getTransformedOffers(),
    metrics: getMetrics(),
    
    // Loading states
    loading,
    
    // Error states
    error,
    
    // Fetch functions
    fetchForecast,
    fetchRFM,
    fetchDiscounts,
    fetchRunAll,
    fetchExplainForecast,
    
    // Refresh all data
    refreshAll: fetchRunAll,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

