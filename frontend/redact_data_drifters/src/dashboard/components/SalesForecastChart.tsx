import { motion } from 'motion/react';
import { Card } from './ui/card';
import { LineChart, Line, Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, BarChart, Cell } from 'recharts';
import { useDashboard, formatCurrency } from '../context/DashboardContext';
import { useFilters } from '../context/FilterContext';
import { useData } from '@/context/DataContext';
import { useMemo } from 'react';
import { Maximize2 } from 'lucide-react';
import { BarChart3D } from './Chart3D';

interface SalesForecastChartProps {
  onExpand: () => void;
}

export function SalesForecastChart({ onExpand }: SalesForecastChartProps) {
  const { is3DMode, currency, exchangeRate } = useDashboard();
  const { filters, applyFilters } = useFilters();
  const { transformedForecast, forecastData, loading, error } = useData();
  
  // Apply filters to forecast data
  const filteredForecastData = useMemo(() => {
    if (!filters.metrics.forecast) return [];
    if (!transformedForecast || transformedForecast.length === 0) return [];
    return applyFilters(transformedForecast);
  }, [filters, applyFilters, transformedForecast]);
  
  const last4Forecasts = useMemo(() => {
    // Use raw forecast data from API (forecastData.forecast) which has {date, prediction}
    // This is more reliable than transformedForecast for getting the last 4 predictions
    const forecast = forecastData?.forecast || [];
    if (forecast.length > 0) {
      // Get last 4 items from the forecast array
      return forecast.slice(-4).map(f => ({
        date: f.date || '',
        prediction: f.prediction || 0,
      }));
    }
    // Fallback to transformedForecast if raw data not available
    if (transformedForecast && transformedForecast.length > 0) {
      return transformedForecast.slice(-4).map(f => ({
        date: f.week || f.date || '',
        prediction: f.forecast || f.prediction || 0,
      }));
    }
    return [];
  }, [forecastData, transformedForecast]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-blue-500/20 bg-gradient-to-br from-blue-950/70 to-blue-900/40 backdrop-blur-sm">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
            <div>
              <h2 className="text-lg sm:text-xl text-white mb-1">
                Sales Forecast - Next 4 Days {is3DMode && <span className="text-cyan-400 text-sm">(3D Mode)</span>}
              </h2>
              <p className="text-xs sm:text-sm text-blue-200/70">AI-Powered Daily Sales Predictions</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onExpand}
              className="px-3 sm:px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-400/30 text-blue-300 hover:bg-blue-500/30 transition-all text-sm flex items-center gap-2"
            >
              <Maximize2 className="h-4 w-4" />
              <span className="hidden sm:inline">Expand Analysis</span>
              <span className="sm:hidden">Expand</span>
            </motion.button>
          </div>

          <div className="h-[300px] sm:h-[400px]">
            {loading.forecast || loading.runAll ? (
              <div className="flex items-center justify-center h-full text-blue-300">
                <p>Loading forecast data...</p>
              </div>
            ) : error.runAll || error.forecast ? (
              <div className="flex flex-col items-center justify-center h-full text-yellow-400 p-4 text-center">
                <p className="text-lg font-semibold mb-2">⚠️ Cannot Load Data</p>
                <p className="text-sm text-blue-300 mb-4">
                  {error.runAll || error.forecast}
                </p>
                <p className="text-xs text-blue-400">
                  Make sure both Backend (port 5000) and ML Server (port 8000) are running
                </p>
              </div>
            ) : filteredForecastData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-blue-300">
                <p>No forecast data available</p>
              </div>
            ) : is3DMode ? (
              <BarChart3D 
                data={filteredForecastData}
                dataKey="forecast"
                xKey="week"
                height={400}
                color="#0ea5e9"
              />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredForecastData}>
                  <defs>
                    <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis 
                    dataKey="week" 
                    stroke="#94a3b8"
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    tickFormatter={(value) => formatCurrency(value, currency)}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                    formatter={(value: number) => [formatCurrency(value, currency), '']}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}
                    iconType="line"
                  />
                  <Area
                    type="monotone"
                    dataKey="confidence_upper"
                    stroke="none"
                    fill="url(#colorConfidence)"
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    dataKey="confidence_lower"
                    stroke="none"
                    fill="#0f172a"
                    fillOpacity={1}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 3 }}
                    name="Historical Sales"
                    connectNulls
                  />
                  <Line 
                    type="monotone" 
                    dataKey="forecast" 
                    stroke="#0ea5e9" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#0ea5e9', r: 3 }}
                    name="Forecasted Sales"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mt-4 sm:mt-6">
            {last4Forecasts.length > 0 ? (
              last4Forecasts.map((forecast, index) => {
                let formattedDate = '';
                if (forecast.date) {
                  try {
                    const date = new Date(forecast.date);
                    if (!isNaN(date.getTime())) {
                      formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
                    } else {
                      formattedDate = forecast.date;
                    }
                  } catch {
                    formattedDate = forecast.date;
                  }
                } else {
                  formattedDate = `Day ${index + 1}`;
                }
                
                return (
                  <div key={index} className="p-3 sm:p-4 rounded-lg bg-blue-500/10 border border-blue-400/20">
                    <p className="text-xs sm:text-sm text-blue-200/70 mb-1">{formattedDate}</p>
                    <p className="text-lg sm:text-xl text-white font-semibold">
                      {forecast.prediction > 0 ? formatCurrency(forecast.prediction, currency) : 'N/A'}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="col-span-4 p-4 text-center text-blue-300">
                <p>No forecast data available</p>
              </div>
            )}
          </div>

          <div className="mt-4 p-3 sm:p-4 rounded-lg bg-gradient-to-r from-cyan-500/10 to-transparent border border-cyan-400/20">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-blue-200/70 mb-1">4-Day Total</p>
                <p className="text-lg sm:text-xl text-white font-semibold">
                  {last4Forecasts.length > 0 
                    ? formatCurrency(last4Forecasts.reduce((sum, f) => sum + (f.prediction || 0), 0), currency)
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-200/70 mb-1">Daily Average</p>
                <p className="text-lg sm:text-xl text-white font-semibold">
                  {last4Forecasts.length > 0 
                    ? formatCurrency(last4Forecasts.reduce((sum, f) => sum + (f.prediction || 0), 0) / last4Forecasts.length, currency)
                    : 'N/A'}
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-xs text-blue-200/70 mb-1">Confidence</p>
                <p className="text-lg sm:text-xl text-green-400 font-semibold">
                  {last4Forecasts.length > 0 ? 'High' : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
