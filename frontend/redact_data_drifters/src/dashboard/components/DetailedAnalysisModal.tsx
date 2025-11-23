import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LineChart, Line, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useDashboard, formatCurrency } from '../context/DashboardContext';
import { useData } from '@/context/DataContext';

interface DetailedAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'forecast' | 'segments' | 'metric' | null;
  title: string;
}

export function DetailedAnalysisModal({ isOpen, onClose, type, title }: DetailedAnalysisModalProps) {
  const { is3DMode, currency } = useDashboard();
  const { transformedForecast, transformedSegments, rfmData, loading } = useData();
  
  // Use API data or show loading/empty state
  const forecastData = transformedForecast || [];
  const segmentsData = transformedSegments || [];
  const rfmTableData = rfmData?.rfm_table || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-6xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-blue-950/98 to-blue-900/95 border-blue-500/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">{title}</DialogTitle>
          <DialogDescription className="text-blue-200/70">
            {type === 'forecast' && 'Detailed analysis of sales forecasts with trends and seasonality'}
            {type === 'segments' && 'In-depth customer segmentation analysis with RFM metrics'}
            {type === 'metric' && 'Comprehensive metric analysis with historical trends'}
          </DialogDescription>
        </DialogHeader>

        {type === 'forecast' && (
          <Tabs defaultValue="trend" className="w-full">
            <TabsList className="bg-blue-900/50 w-full sm:w-auto overflow-x-auto flex-nowrap">
              <TabsTrigger value="trend" className="text-xs sm:text-sm">Trend Analysis</TabsTrigger>
              <TabsTrigger value="confidence" className="text-xs sm:text-sm">Confidence Intervals</TabsTrigger>
              <TabsTrigger value="seasonality" className="text-xs sm:text-sm">Seasonality</TabsTrigger>
            </TabsList>

            <TabsContent value="trend" className="space-y-4">
              <div className="h-[300px] sm:h-[400px]" style={is3DMode ? {
                transform: 'perspective(1200px) rotateX(5deg)',
                transformStyle: 'preserve-3d',
              } : {}}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={forecastData.length > 0 ? forecastData : []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="week" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#94a3b8" tickFormatter={(v) => formatCurrency(v, currency)} tick={{ fontSize: 10 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      formatter={(value: number) => [formatCurrency(value, currency), '']}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} name="Actual" />
                    <Line type="monotone" dataKey="forecast" stroke="#0ea5e9" strokeWidth={2} name="Forecast" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              {forecastData.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 rounded-lg bg-blue-500/10 border border-blue-400/20">
                    <p className="text-xs sm:text-sm text-blue-200/70">Average Growth Rate</p>
                    <p className="text-xl sm:text-2xl">
                      {forecastData.length > 1 
                        ? `${(((forecastData[forecastData.length - 1].forecast - forecastData[0].forecast) / forecastData[0].forecast) * 100).toFixed(1)}%`
                        : 'N/A'}
                    </p>
                    <p className="text-xs text-green-400">per period</p>
                  </div>
                  <div className="p-3 sm:p-4 rounded-lg bg-blue-500/10 border border-blue-400/20">
                    <p className="text-xs sm:text-sm text-blue-200/70">Total Forecast</p>
                    <p className="text-xl sm:text-2xl">
                      {formatCurrency(forecastData.reduce((sum, f) => sum + (f.forecast || 0), 0), currency)}
                    </p>
                    <p className="text-xs text-blue-300">{forecastData.length} days</p>
                  </div>
                  <div className="p-3 sm:p-4 rounded-lg bg-blue-500/10 border border-blue-400/20">
                    <p className="text-xs sm:text-sm text-blue-200/70">Data Points</p>
                    <p className="text-xl sm:text-2xl">{forecastData.length}</p>
                    <p className="text-xs text-green-400">forecast days</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center text-blue-300">
                  {loading.runAll ? 'Loading forecast data...' : 'No forecast data available'}
                </div>
              )}
            </TabsContent>

            <TabsContent value="confidence">
              <div className="h-[300px] sm:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={forecastData.length > 0 ? forecastData.slice(-4) : []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="week" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#94a3b8" tickFormatter={(v) => formatCurrency(v, currency)} tick={{ fontSize: 10 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      formatter={(value: number) => [formatCurrency(value, currency), '']}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Line type="monotone" dataKey="confidence_upper" stroke="#f59e0b" name="Upper Bound" />
                    <Line type="monotone" dataKey="forecast" stroke="#0ea5e9" name="Forecast" />
                    <Line type="monotone" dataKey="confidence_lower" stroke="#f59e0b" name="Lower Bound" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="seasonality">
              <div className="h-[300px] sm:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={forecastData.length > 0 ? forecastData : []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="week" stroke="#94a3b8" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="#94a3b8" tickFormatter={(v) => formatCurrency(v, currency)} tick={{ fontSize: 10 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      formatter={(value: number) => [formatCurrency(value, currency), '']}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="forecast" fill="#0ea5e9" name="Daily Forecast" />
                    <Bar dataKey="actual" fill="#10b981" name="Historical Sales" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-3 sm:p-4 rounded-lg bg-blue-500/10 border border-blue-400/20">
                <p className="text-xs sm:text-sm text-blue-200/70 mb-2">Seasonality Pattern</p>
                <p className="text-sm text-white">
                  Sales show higher patterns on weekends (Friday-Sunday) with peak performance on Saturdays. 
                  Mid-week (Tuesday-Thursday) shows consistent moderate sales.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {type === 'segments' && (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-blue-900/50 w-full sm:w-auto overflow-x-auto">
              <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
              <TabsTrigger value="rfm" className="text-xs sm:text-sm">RFM Analysis</TabsTrigger>
              <TabsTrigger value="regional" className="text-xs sm:text-sm">Regional</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="h-[300px] sm:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={segmentsData.length > 0 ? segmentsData : []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="segment" stroke="#94a3b8" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="#94a3b8" tickFormatter={(v) => formatCurrency(v, currency)} tick={{ fontSize: 10 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      formatter={(value: number, name: string) => [
                        name === 'Customer Count' ? value : formatCurrency(value, currency),
                        name
                      ]}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="count" fill="#3b82f6" name="Customer Count" />
                    <Bar dataKey="revenue" fill="#0ea5e9" name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="rfm">
              <div className="h-[300px] sm:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={rfmTableData.length > 0 ? rfmTableData.slice(0, 50) : []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="frequency" name="Frequency" stroke="#94a3b8" tick={{ fontSize: 10 }} type="number" />
                    <YAxis dataKey="monetary" name="Monetary Value" stroke="#94a3b8" tick={{ fontSize: 10 }} tickFormatter={(v) => formatCurrency(v, currency)} type="number" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      formatter={(value: number, name: string) => [
                        name === 'Monetary Value' ? formatCurrency(value, currency) : value,
                        name
                      ]}
                      cursor={{ strokeDasharray: '3 3' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Scatter name="Customers" dataKey="monetary" fill="#0ea5e9" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              {rfmTableData.length > 0 ? (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 rounded-lg bg-blue-500/10 border border-blue-400/20">
                    <p className="text-xs sm:text-sm text-blue-200/70">Recency (Days)</p>
                    <p className="text-xl sm:text-2xl">
                      {Math.round(rfmTableData.reduce((sum, c) => sum + (c.Recency || c.recency || 0), 0) / rfmTableData.length)}
                    </p>
                    <p className="text-xs text-blue-300">Average</p>
                  </div>
                  <div className="p-3 sm:p-4 rounded-lg bg-blue-500/10 border border-blue-400/20">
                    <p className="text-xs sm:text-sm text-blue-200/70">Frequency</p>
                    <p className="text-xl sm:text-2xl">
                      {Math.round(rfmTableData.reduce((sum, c) => sum + (c.Frequency || c.frequency || 0), 0) / rfmTableData.length)}
                    </p>
                    <p className="text-xs text-blue-300">Average Orders</p>
                  </div>
                  <div className="p-3 sm:p-4 rounded-lg bg-blue-500/10 border border-blue-400/20">
                    <p className="text-xs sm:text-sm text-blue-200/70">Monetary Value</p>
                    <p className="text-xl sm:text-2xl">
                      {formatCurrency(Math.round(rfmTableData.reduce((sum, c) => sum + (c.Monetary || c.monetary || 0), 0) / rfmTableData.length), currency)}
                    </p>
                    <p className="text-xs text-blue-300">Average</p>
                  </div>
                </div>
              ) : (
                <div className="mt-4 p-4 text-center text-blue-300">
                  {loading.rfm || loading.runAll ? 'Loading RFM data...' : 'No RFM data available'}
                </div>
              )}
            </TabsContent>

            <TabsContent value="regional">
              <div className="h-[300px] sm:h-[400px]">
                {segmentsData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={segmentsData.map(s => ({ region: s.segment, sales: s.revenue, customers: s.count }))}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="region" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis stroke="#94a3b8" tick={{ fontSize: 10 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      formatter={(value: number, name: string) => [
                        name === 'Sales' ? formatCurrency(value, currency) : value,
                        name
                      ]}
                    />
                      <Radar name="Sales" dataKey="sales" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.5} />
                      <Radar name="Customers" dataKey="customers" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-blue-300">
                    {loading.runAll ? 'Loading segment data...' : 'No segment data available'}
                  </div>
                )}
              </div>
              {segmentsData.length > 0 && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {segmentsData.map((segment, index) => (
                    <div key={index} className="p-3 sm:p-4 rounded-lg bg-blue-500/10 border border-blue-400/20">
                      <p className="text-xs sm:text-sm text-blue-200/70 mb-1">{segment.segment}</p>
                      <p className="text-lg sm:text-xl text-white font-semibold">{formatCurrency(segment.revenue, currency)}</p>
                      <p className="text-xs text-blue-300">{segment.count} customers</p>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        {type === 'metric' && (
          <div className="space-y-4">
            <div className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastData.length > 0 ? forecastData.slice(0, 12) : []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="week" stroke="#94a3b8" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="#94a3b8" tickFormatter={(v) => formatCurrency(v, currency)} tick={{ fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value: number) => [formatCurrency(value, currency), '']}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} name="Historical" />
                  <Line type="monotone" dataKey="forecast" stroke="#0ea5e9" strokeWidth={2} name="Forecast" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {forecastData.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 rounded-lg bg-blue-500/10 border border-blue-400/20">
                  <p className="text-xs sm:text-sm text-blue-200/70">Current Value</p>
                  <p className="text-xl sm:text-2xl">
                    {title.includes('Revenue') || title.includes('Sales') 
                      ? formatCurrency(forecastData.reduce((sum, f) => sum + (f.forecast || 0), 0), currency)
                      : `${Math.round((forecastData.length / 28) * 100)}%`}
                  </p>
                </div>
                <div className="p-3 sm:p-4 rounded-lg bg-blue-500/10 border border-blue-400/20">
                  <p className="text-xs sm:text-sm text-blue-200/70">Previous Period</p>
                  <p className="text-xl sm:text-2xl">
                    {title.includes('Revenue') || title.includes('Sales')
                      ? formatCurrency(forecastData.slice(0, Math.floor(forecastData.length / 2)).reduce((sum, f) => sum + (f.forecast || 0), 0), currency)
                      : `${Math.round((forecastData.length / 2 / 28) * 100)}%`}
                  </p>
                </div>
                <div className="p-3 sm:p-4 rounded-lg bg-blue-500/10 border border-blue-400/20">
                  <p className="text-xs sm:text-sm text-blue-200/70">Growth</p>
                  <p className="text-xl sm:text-2xl text-green-400">
                    {forecastData.length > 1 
                      ? `+${(((forecastData[forecastData.length - 1].forecast - forecastData[0].forecast) / forecastData[0].forecast) * 100).toFixed(1)}%`
                      : 'N/A'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center text-blue-300">
                {loading.runAll ? 'Loading metric data...' : 'No metric data available'}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
