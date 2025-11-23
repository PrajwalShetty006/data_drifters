import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { 
  BarChart, Bar, LineChart, Line, ScatterChart, Scatter, AreaChart, Area, 
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, 
  ScatterChart as ScatterChartIcon, TrendingUp, Sparkles, Download, 
  RefreshCw, Settings2, Filter, Palette, Sliders, Eye, Database,
  Calendar, DollarSign, Users, TrendingDown, Activity, X
} from 'lucide-react';
import { useDashboard, formatCurrency } from '../context/DashboardContext';
import { useData } from '@/context/DataContext';
import { BarChart3D } from './Chart3D';

interface CustomChartBuilderProps {
  isOpen: boolean;
  onClose: () => void;
}

const CHART_TYPES = [
  { value: 'bar', label: 'Bar Chart', icon: BarChart3, description: 'Compare values across categories' },
  { value: 'line', label: 'Line Chart', icon: LineChartIcon, description: 'Show trends over time' },
  { value: 'area', label: 'Area Chart', icon: TrendingUp, description: 'Visualize volume changes' },
  { value: 'pie', label: 'Pie Chart', icon: PieChartIcon, description: 'Show proportions' },
  { value: 'scatter', label: 'Scatter Plot', icon: ScatterChartIcon, description: 'Find correlations' },
  { value: 'radar', label: 'Radar Chart', icon: Activity, description: 'Multi-dimensional data' },
];

const COLOR_SCHEMES = [
  { name: 'Ocean Blue', colors: ['#0ea5e9', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6'] },
  { name: 'Sunset', colors: ['#f59e0b', '#f97316', '#ef4444', '#ec4899', '#d946ef'] },
  { name: 'Forest', colors: ['#10b981', '#14b8a6', '#22c55e', '#84cc16', '#a3e635'] },
  { name: 'Purple Haze', colors: ['#8b5cf6', '#a78bfa', '#c084fc', '#d8b4fe', '#e9d5ff'] },
  { name: 'Monochrome', colors: ['#1e293b', '#334155', '#475569', '#64748b', '#94a3b8'] },
];

export function CustomChartBuilder({ isOpen, onClose }: CustomChartBuilderProps) {
  const { currency, is3DMode } = useDashboard();
  const { transformedForecast, transformedSegments, transformedOffers, rfmData, loading } = useData();
  
  // Chart Configuration
  const [chartType, setChartType] = useState('bar');
  const [dataSource, setDataSource] = useState('forecast');
  const [xAxis, setXAxis] = useState('week');
  const [yAxis, setYAxis] = useState('forecast');
  const [chartTitle, setChartTitle] = useState('Sales Forecast Analysis');
  
  // Visual Customization
  const [use3D, setUse3D] = useState(is3DMode);
  const [colorScheme, setColorScheme] = useState(0);
  const [showGrid, setShowGrid] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [chartOpacity, setChartOpacity] = useState([80]);
  const [barRadius, setBarRadius] = useState([8]);
  const [lineWidth, setLineWidth] = useState([3]);
  
  // Filters
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('none');
  const [limitData, setLimitData] = useState('all');

  // Get raw data based on source - memoized to avoid recreating on every render
  const rawData = useMemo(() => {
    if (dataSource === 'forecast') return transformedForecast || [];
    if (dataSource === 'segments') return transformedSegments || [];
    if (dataSource === 'rfm') return (rfmData?.rfm_table || []).slice(0, 50); // Limit RFM data
    if (dataSource === 'offers') return transformedOffers || [];
    return transformedForecast || [];
  }, [dataSource, transformedForecast, transformedSegments, transformedOffers, rfmData]);

  // Apply all filters and transformations
  const chartData = useMemo(() => {
    let data = [...rawData];

    // Search filter
    if (searchFilter) {
      data = data.filter((item: any) => 
        Object.values(item).some(val => 
          String(val).toLowerCase().includes(searchFilter.toLowerCase())
        )
      );
    }

    // Value range filter
    if (minValue || maxValue) {
      data = data.filter((item: any) => {
        const value = Number(item[yAxis]);
        if (isNaN(value)) return true;
        if (minValue && value < Number(minValue)) return false;
        if (maxValue && value > Number(maxValue)) return false;
        return true;
      });
    }

    // Sort data
    if (sortOrder !== 'none') {
      data.sort((a: any, b: any) => {
        const aVal = Number(a[yAxis]) || 0;
        const bVal = Number(b[yAxis]) || 0;
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      });
    }

    // Limit data points
    if (limitData !== 'all') {
      const limit = Number(limitData);
      data = data.slice(0, limit);
    }

    return data;
  }, [rawData, yAxis, searchFilter, minValue, maxValue, sortOrder, limitData]);

  const getAxisOptions = () => {
    if (dataSource === 'forecast') {
      return {
        x: ['week', 'date', 'dayOfWeek'],
        y: ['actual', 'forecast', 'confidence_upper', 'confidence_lower']
      };
    }
    if (dataSource === 'segments') {
      return {
        x: ['segment', 'name'],
        y: ['count', 'revenue', 'avgOrderValue']
      };
    }
    if (dataSource === 'rfm') {
      return {
        x: ['customerId', 'segment', 'recency'],
        y: ['recency', 'frequency', 'monetary']
      };
    }
    if (dataSource === 'offers') {
      return {
        x: ['segment'],
        y: ['estimatedRevenue', 'priority']
      };
    }
    return { x: ['week'], y: ['forecast'] };
  };

  const handleReset = () => {
    setChartType('bar');
    setDataSource('forecast');
    setXAxis('week');
    setYAxis('forecast');
    setChartTitle('Sales Forecast Analysis');
    setUse3D(is3DMode);
    setColorScheme(0);
    setShowGrid(true);
    setShowLegend(true);
    setChartOpacity([80]);
    setBarRadius([8]);
    setLineWidth([3]);
    setMinValue('');
    setMaxValue('');
    setSearchFilter('');
    setSortOrder('none');
    setLimitData('all');
  };

  const handleExport = () => {
    try {
      const exportData = {
        chartConfig: {
          type: chartType,
          title: chartTitle,
          dataSource,
          xAxis,
          yAxis,
          use3D,
          colorScheme: COLOR_SCHEMES[colorScheme].name,
        },
        data: chartData,
        filters: {
          search: searchFilter,
          minValue,
          maxValue,
          sortOrder,
          limitData
        }
      };
      
      console.log('Exporting chart configuration:', exportData);
      
      // Create downloadable JSON
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `chart-config-${Date.now()}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement);
    } catch (error) {
      console.error('Error exporting chart:', error);
      alert('Failed to export chart. Please try again.');
    }
  };

  const renderChart = () => {
    const data = chartData;
    const colors = COLOR_SCHEMES[colorScheme].colors;
    const opacity = chartOpacity[0] / 100;

    const chartProps = {
      data,
      style: use3D ? {
        transform: 'perspective(1200px) rotateX(8deg) rotateY(-5deg)',
        transformStyle: 'preserve-3d' as const,
      } : {}
    };

    const tooltipStyle = {
      backgroundColor: 'rgba(15, 23, 42, 0.98)', 
      border: '2px solid rgba(59, 130, 246, 0.4)',
      borderRadius: '12px',
      padding: '12px',
      color: '#fff',
      fontSize: '13px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
    };

    const commonAxisProps = {
      stroke: '#94a3b8',
      tick: { fill: '#94a3b8', fontSize: 11 },
    };

    switch (chartType) {
      case 'bar':
        if (use3D) {
          return <BarChart3D data={data} dataKey={yAxis} xKey={xAxis} height={500} color={colors[0]} />;
        }
        return (
          <ResponsiveContainer width="100%" height="100%" minHeight={650}>
            <BarChart data={data}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />}
              <XAxis 
                dataKey={xAxis} 
                {...commonAxisProps}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                {...commonAxisProps}
                tickFormatter={(v) => typeof v === 'number' ? formatCurrency(v, currency) : v} 
              />
              <Tooltip 
                contentStyle={tooltipStyle} 
                formatter={(value: number) => [formatCurrency(value, currency), yAxis]} 
              />
              {showLegend && <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '13px' }} />}
              <Bar 
                dataKey={yAxis} 
                fill={colors[0]} 
                fillOpacity={opacity}
                radius={[barRadius[0], barRadius[0], 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%" minHeight={650}>
            <LineChart {...chartProps} data={data}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />}
              <XAxis 
                dataKey={xAxis} 
                {...commonAxisProps}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                {...commonAxisProps}
                tickFormatter={(v) => typeof v === 'number' ? formatCurrency(v, currency) : v} 
              />
              <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [formatCurrency(value, currency), yAxis]} />
              {showLegend && <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '13px' }} />}
              <Line 
                type="monotone" 
                dataKey={yAxis} 
                stroke={colors[0]} 
                strokeWidth={lineWidth[0]}
                strokeOpacity={opacity}
                dot={{ fill: colors[0], r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%" minHeight={650}>
            <AreaChart {...chartProps} data={data}>
              <defs>
                <linearGradient id="customAreaColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors[0]} stopOpacity={opacity}/>
                  <stop offset="95%" stopColor={colors[0]} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />}
              <XAxis 
                dataKey={xAxis} 
                {...commonAxisProps}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                {...commonAxisProps}
                tickFormatter={(v) => typeof v === 'number' ? formatCurrency(v, currency) : v} 
              />
              <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [formatCurrency(value, currency), yAxis]} />
              {showLegend && <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '13px' }} />}
              <Area 
                type="monotone" 
                dataKey={yAxis} 
                stroke={colors[0]} 
                strokeWidth={2}
                fill="url(#customAreaColor)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        // Filter pie chart data to only include valid numeric values
        const pieData = data.filter((item: any) => {
          const val = Number(item[yAxis]);
          return !isNaN(val) && val > 0;
        });
        
        if (pieData.length === 0) {
          return (
            <div className="flex items-center justify-center h-full text-blue-300" style={{ minHeight: '500px' }}>
              <p>No valid data for pie chart. Please check your value field selection.</p>
            </div>
          );
        }
        
        return (
          <ResponsiveContainer width="100%" height="100%" minHeight={650}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey={yAxis}
                nameKey={xAxis}
                cx="50%"
                cy="50%"
                outerRadius={use3D ? 160 : 140}
                innerRadius={use3D ? 70 : 0}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                labelLine={!use3D}
                style={use3D ? {
                  filter: 'drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.6))',
                } : {}}
              >
                {pieData.map((entry: any, index: number) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colors[index % colors.length]} 
                    fillOpacity={opacity}
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              {showLegend && <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '13px' }} />}
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'scatter':
        // Filter and transform data for scatter chart - ensure numeric values
        const scatterData = data
          .map((item: any) => ({
            ...item,
            [xAxis]: Number(item[xAxis]) || 0,
            [yAxis]: Number(item[yAxis]) || 0,
          }))
          .filter((item: any) => !isNaN(item[xAxis]) && !isNaN(item[yAxis]));
        
        if (scatterData.length === 0) {
          return (
            <div className="flex items-center justify-center h-full text-blue-300" style={{ minHeight: '500px' }}>
              <p>No valid numeric data for scatter chart. Please check your axis selection.</p>
            </div>
          );
        }
        
        return (
          <ResponsiveContainer width="100%" height="100%" minHeight={650}>
            <ScatterChart {...chartProps} data={scatterData}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />}
              <XAxis 
                dataKey={xAxis} 
                {...commonAxisProps}
                name={xAxis}
                type="number"
              />
              <YAxis 
                dataKey={yAxis} 
                {...commonAxisProps}
                name={yAxis}
                type="number"
              />
              <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: '3 3' }} />
              {showLegend && <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '13px' }} />}
              <Scatter 
                name={`${xAxis} vs ${yAxis}`} 
                data={scatterData} 
                fill={colors[0]} 
                fillOpacity={opacity}
              />
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'radar':
        // Filter data to only include valid numeric values for radar chart
        const radarData = data
          .filter((item: any) => {
            const val = Number(item[yAxis]);
            return !isNaN(val) && val >= 0;
          })
          .slice(0, 12);
        
        if (radarData.length === 0) {
          return (
            <div className="flex items-center justify-center h-full text-blue-300" style={{ minHeight: '500px' }}>
              <p>No valid data for radar chart. Please check your axis selection.</p>
            </div>
          );
        }
        
        return (
          <ResponsiveContainer width="100%" height="100%" minHeight={650}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey={xAxis} stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <PolarRadiusAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <Radar 
                name={yAxis} 
                dataKey={yAxis} 
                stroke={colors[0]} 
                fill={colors[0]} 
                fillOpacity={opacity}
                strokeWidth={2}
              />
              <Tooltip contentStyle={tooltipStyle} />
              {showLegend && <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '13px' }} />}
            </RadarChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  const axisOptions = getAxisOptions();
  const dataStats = useMemo(() => {
    const data = chartData;
    const values = data.map((item: any) => Number(item[yAxis])).filter((v: number) => !isNaN(v));
    if (values.length === 0) {
      return { count: 0, min: 0, max: 0, avg: 0 };
    }
    return {
      count: data.length,
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((a: number, b: number) => a + b, 0) / values.length || 0
    };
  }, [chartData, yAxis]);

  // Render as dedicated section (not in dialog)
  if (!isOpen) {
    return (
      <div className="flex flex-col w-full min-h-[800px] bg-gradient-to-br from-slate-950 via-blue-950/95 to-slate-950 text-white rounded-xl overflow-hidden border border-blue-500/30">
        {/* Header */}
        <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-blue-500/30 flex-shrink-0 bg-gradient-to-r from-blue-950/50 to-transparent">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-blue-500/30 to-cyan-500/20 border border-blue-400/40">
                  <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-blue-300" />
                </div>
                <span className="truncate">Advanced Chart Builder</span>
              </h2>
              <p className="text-blue-200/70 text-sm sm:text-base hidden sm:block">
                Create, customize, and analyze your data with powerful visualization tools
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
          <div className="flex-1 overflow-hidden min-h-0 flex">
            <div className="flex gap-6 lg:gap-8 p-4 lg:p-6 h-full w-full">
              {/* Left Column - All Features, Controls, Buttons */}
              <div className="w-[380px] min-w-[380px] max-w-[380px] overflow-y-auto overflow-x-hidden pr-2 h-full relative z-10 pointer-events-auto visible block bg-gradient-to-b from-blue-950/40 to-blue-950/20 rounded-lg border border-blue-500/20 p-2 flex-shrink-0" style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(59, 130, 246, 0.5) rgba(15, 23, 42, 0.1)'
              }}>
                <style>{`
                  .custom-chart-sidebar::-webkit-scrollbar {
                    width: 8px;
                  }
                  .custom-chart-sidebar::-webkit-scrollbar-track {
                    background: rgba(15, 23, 42, 0.5);
                    border-radius: 4px;
                  }
                  .custom-chart-sidebar::-webkit-scrollbar-thumb {
                    background: rgba(59, 130, 246, 0.5);
                    border-radius: 4px;
                  }
                  .custom-chart-sidebar::-webkit-scrollbar-thumb:hover {
                    background: rgba(59, 130, 246, 0.7);
                  }
                `}</style>
                <Tabs defaultValue="data" className="h-full w-full custom-chart-sidebar relative z-10">
                  <TabsList className="grid w-full grid-cols-3 bg-blue-900/30 border border-blue-500/20 mb-3 sm:mb-4 flex-shrink-0 sticky top-0 z-20 relative">
                    <TabsTrigger value="data" className="data-[state=active]:bg-blue-500/30 text-xs">
                      <Database className="h-2.5 w-2.5 mr-1" />
                      <span>Data</span>
                    </TabsTrigger>
                    <TabsTrigger value="style" className="data-[state=active]:bg-blue-500/30 text-xs">
                      <Palette className="h-2.5 w-2.5 mr-1" />
                      <span>Style</span>
                    </TabsTrigger>
                    <TabsTrigger value="filters" className="data-[state=active]:bg-blue-500/30 text-xs">
                      <Filter className="h-2.5 w-2.5 mr-1" />
                      <span>Filters</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Action Buttons - Export and Reset */}
                  <div className="flex gap-2 mb-4 flex-shrink-0 relative z-10 pointer-events-auto">
                    <Button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleExport();
                      }}
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 text-xs sm:text-sm"
                    >
                      <Download className="h-2.5 w-2.5 mr-1" />
                      <span className="text-xs">Export</span>
                    </Button>
                    <Button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleReset();
                      }}
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-blue-500/10 border-blue-400/30 text-blue-300 hover:bg-blue-500/20 text-xs"
                    >
                      <RefreshCw className="h-2.5 w-2.5 mr-1" />
                      <span>Reset</span>
                    </Button>
                  </div>

                  {/* Data Tab */}
                  <TabsContent value="data" className="space-y-3 sm:space-y-4 mt-0 pb-4 visible relative z-10 pointer-events-auto">
                    {/* Chart Title */}
                    <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-400/20 relative z-10 pointer-events-auto">
                      <Label className="text-blue-200 mb-2 block">Chart Title</Label>
                      <Input
                        value={chartTitle}
                        onChange={(e) => {
                          setChartTitle(e.target.value);
                        }}
                        onKeyDown={(e) => {
                          e.stopPropagation();
                        }}
                        className="bg-blue-900/30 border-blue-500/20 text-white relative z-10 pointer-events-auto"
                        placeholder="Enter chart title..."
                      />
                    </div>

                    {/* Chart Type Selection */}
                    <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-400/20 relative z-10 pointer-events-auto">
                      <Label className="text-white mb-3 flex items-center gap-2">
                        <Sparkles className="h-3 w-3 text-blue-400" />
                        Chart Type
                      </Label>
                      <div className="grid grid-cols-2 gap-2 relative z-10 pointer-events-auto">
                        {CHART_TYPES.map((type) => {
                          const Icon = type.icon;
                          return (
                            <button
                              key={type.value}
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setChartType(type.value);
                              }}
                              className={`p-2 rounded-lg border-2 transition-all text-left cursor-pointer relative z-10 pointer-events-auto ${
                                chartType === type.value
                                  ? 'border-blue-400 bg-blue-500/30'
                                  : 'border-blue-400/20 bg-blue-500/5 hover:bg-blue-500/10'
                              }`}
                              title={type.description}
                            >
                              <Icon className={`h-4 w-4 mb-1 ${chartType === type.value ? 'text-blue-300' : 'text-blue-400/70'}`} />
                              <p className={`text-xs ${chartType === type.value ? 'text-white' : 'text-blue-200/70'}`}>
                                {type.label.split(' ')[0]}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Data Configuration */}
                    <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-400/20 relative z-10 pointer-events-auto">
                      <Label className="text-white mb-3 flex items-center gap-2">
                        <Settings2 className="h-3 w-3 text-blue-400" />
                        Data Configuration
                      </Label>

                      <div className="space-y-3 relative z-10">
                        {/* Data Source */}
                        <div>
                          <Label className="text-blue-200 mb-2 block text-sm">Data Source</Label>
                          <Select 
                            value={dataSource} 
                            onValueChange={(val) => {
                              setDataSource(val);
                              // Update axes based on data source
                              if (val === 'forecast') {
                                setXAxis('week');
                                setYAxis('forecast');
                              } else if (val === 'segments') {
                                setXAxis('segment');
                                setYAxis('count');
                              } else if (val === 'rfm') {
                                setXAxis('customerId');
                                setYAxis('monetary');
                              } else if (val === 'offers') {
                                setXAxis('segment');
                                setYAxis('estimatedRevenue');
                              }
                            }}
                          >
                            <SelectTrigger className="bg-blue-900/30 border-blue-500/20 text-white relative z-10 pointer-events-auto">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-blue-950 border-blue-500/20 !z-[1000] pointer-events-auto">
                              <SelectItem value="forecast">📈 Sales Forecast</SelectItem>
                              <SelectItem value="segments">👥 Customer Segments</SelectItem>
                              <SelectItem value="rfm">💎 RFM Analysis</SelectItem>
                              <SelectItem value="offers">🎯 Targeted Offers</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* X Axis */}
                        {chartType !== 'pie' && (
                          <div className="relative z-10">
                            <Label className="text-blue-200 mb-2 block text-sm">X-Axis</Label>
                            <Select 
                              value={xAxis} 
                              onValueChange={(val) => {
                                setXAxis(val);
                              }}
                            >
                              <SelectTrigger className="bg-blue-900/30 border-blue-500/20 text-white relative z-10 pointer-events-auto">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-blue-950 border-blue-500/20 !z-[1000] pointer-events-auto">
                                {axisOptions.x.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {/* Y Axis */}
                        <div className="relative z-10">
                          <Label className="text-blue-200 mb-2 block text-sm">
                            {chartType === 'pie' ? 'Value Field' : 'Y-Axis'}
                          </Label>
                          <Select 
                            value={yAxis} 
                            onValueChange={(val) => {
                              setYAxis(val);
                            }}
                          >
                            <SelectTrigger className="bg-blue-900/30 border-blue-500/20 text-white relative z-10 pointer-events-auto">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-blue-950 border-blue-500/20 !z-[1000] pointer-events-auto">
                              {axisOptions.y.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Data Statistics */}
                    <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-400/20 relative z-10 pointer-events-auto">
                      <h4 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
                        <Activity className="h-3 w-3 text-cyan-400" />
                        Data Statistics
                      </h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-blue-200/70">Data Points:</span>
                          <Badge variant="secondary" className="bg-blue-500/20 text-blue-200">
                            {dataStats.count}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-blue-200/70">Min Value:</span>
                          <span className="text-white font-medium">{formatCurrency(dataStats.min, currency)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-blue-200/70">Max Value:</span>
                          <span className="text-white font-medium">{formatCurrency(dataStats.max, currency)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-blue-200/70">Average:</span>
                          <span className="text-white font-medium">{formatCurrency(dataStats.avg, currency)}</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Style Tab */}
                  <TabsContent value="style" className="space-y-3 sm:space-y-4 mt-0 pb-4 visible relative z-10 pointer-events-auto">
                    {/* 3D Toggle */}
                    <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-400/20 relative z-10 pointer-events-auto">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-white text-sm">Enable 3D Effect</Label>
                          <p className="text-xs text-blue-200/60 mt-1">Add depth to your visualization</p>
                        </div>
                        <Switch 
                          checked={use3D} 
                          onCheckedChange={(checked) => {
                            setUse3D(checked);
                          }}
                          className="relative z-10 pointer-events-auto"
                        />
                      </div>
                    </div>

                    {/* Color Scheme */}
                    <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-400/20 relative z-10 pointer-events-auto">
                      <Label className="text-white mb-3 block">Color Scheme</Label>
                      <div className="space-y-2 relative z-10 pointer-events-auto">
                        {COLOR_SCHEMES.map((scheme, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setColorScheme(index);
                            }}
                            className={`w-full p-3 rounded-lg border-2 transition-all cursor-pointer relative z-10 pointer-events-auto ${
                              colorScheme === index
                                ? 'border-blue-400 bg-blue-500/20'
                                : 'border-blue-400/20 hover:bg-blue-500/10'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-white">{scheme.name}</span>
                              {colorScheme === index && (
                                <Badge variant="secondary" className="bg-blue-400/30 text-blue-200 text-xs">
                                  Active
                                </Badge>
                              )}
                            </div>
                            <div className="flex gap-1">
                              {scheme.colors.map((color, i) => (
                                <div
                                  key={i}
                                  className="flex-1 h-6 rounded"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Visual Options */}
                    <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-400/20 relative z-10 pointer-events-auto">
                      <Label className="text-white mb-3 block">Visual Options</Label>
                      <div className="space-y-3 relative z-10 pointer-events-auto">
                        <div className="flex items-center justify-between relative z-10 pointer-events-auto">
                          <Label className="text-blue-200 text-sm">Show Grid</Label>
                          <Switch 
                            checked={showGrid} 
                            onCheckedChange={(checked) => setShowGrid(checked)}
                            className="relative z-10 pointer-events-auto"
                          />
                        </div>
                        <div className="flex items-center justify-between relative z-10 pointer-events-auto">
                          <Label className="text-blue-200 text-sm">Show Legend</Label>
                          <Switch 
                            checked={showLegend} 
                            onCheckedChange={(checked) => setShowLegend(checked)}
                            className="relative z-10 pointer-events-auto"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sliders */}
                    <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-400/20 relative z-10 pointer-events-auto">
                      <Label className="text-white mb-4 block flex items-center gap-2">
                        <Sliders className="h-3 w-3 text-blue-400" />
                        Fine Tuning
                      </Label>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <Label className="text-blue-200 text-xs">Opacity</Label>
                            <span className="text-blue-300 text-xs">{chartOpacity[0]}%</span>
                          </div>
                          <Slider
                            value={chartOpacity}
                            onValueChange={setChartOpacity}
                            min={10}
                            max={100}
                            step={5}
                            className="cursor-pointer relative z-10 pointer-events-auto"
                          />
                        </div>
                        {chartType === 'bar' && (
                          <div>
                            <div className="flex justify-between mb-2">
                              <Label className="text-blue-200 text-xs">Bar Radius</Label>
                              <span className="text-blue-300 text-xs">{barRadius[0]}px</span>
                            </div>
                            <Slider
                              value={barRadius}
                              onValueChange={setBarRadius}
                              min={0}
                              max={20}
                              step={1}
                              className="cursor-pointer relative z-10 pointer-events-auto"
                            />
                          </div>
                        )}
                        {(chartType === 'line' || chartType === 'area') && (
                          <div>
                            <div className="flex justify-between mb-2">
                              <Label className="text-blue-200 text-xs">Line Width</Label>
                              <span className="text-blue-300 text-xs">{lineWidth[0]}px</span>
                            </div>
                            <Slider
                              value={lineWidth}
                              onValueChange={setLineWidth}
                              min={1}
                              max={8}
                              step={1}
                              className="cursor-pointer relative z-10 pointer-events-auto"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Filters Tab */}
                  <TabsContent value="filters" className="space-y-3 sm:space-y-4 mt-0 pb-4 visible relative z-10 pointer-events-auto">
                    {/* Search Filter */}
                    <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-400/20 relative z-10 pointer-events-auto">
                      <Label className="text-white mb-2 block">Search Filter</Label>
                      <Input
                        value={searchFilter}
                        onChange={(e) => {
                          setSearchFilter(e.target.value);
                        }}
                        onKeyDown={(e) => {
                          e.stopPropagation();
                        }}
                        className="bg-blue-900/30 border-blue-500/20 text-white relative z-10 pointer-events-auto"
                        placeholder="Search in data..."
                      />
                      {searchFilter && (
                        <p className="text-xs text-blue-200/60 mt-2">
                          Found {dataStats.count} matching records
                        </p>
                      )}
                    </div>

                    {/* Value Range */}
                    <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-400/20 relative z-10 pointer-events-auto">
                      <Label className="text-white mb-3 block">Value Range</Label>
                      <div className="grid grid-cols-2 gap-2 relative z-10">
                        <div>
                          <Label className="text-blue-200 text-xs mb-1 block">Min Value</Label>
                          <Input
                            type="number"
                            value={minValue}
                            onChange={(e) => {
                              setMinValue(e.target.value);
                            }}
                            onKeyDown={(e) => {
                              e.stopPropagation();
                            }}
                            className="bg-blue-900/30 border-blue-500/20 text-white relative z-10 pointer-events-auto"
                            placeholder="Min"
                          />
                        </div>
                        <div>
                          <Label className="text-blue-200 text-xs mb-1 block">Max Value</Label>
                          <Input
                            type="number"
                            value={maxValue}
                            onChange={(e) => {
                              setMaxValue(e.target.value);
                            }}
                            onKeyDown={(e) => {
                              e.stopPropagation();
                            }}
                            className="bg-blue-900/30 border-blue-500/20 text-white relative z-10 pointer-events-auto"
                            placeholder="Max"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sort Order */}
                    <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-400/20 relative z-10 pointer-events-auto">
                      <Label className="text-white mb-2 block">Sort Order</Label>
                      <Select 
                        value={sortOrder} 
                        onValueChange={(val) => {
                          setSortOrder(val);
                        }}
                      >
                        <SelectTrigger className="bg-blue-900/30 border-blue-500/20 text-white relative z-10 pointer-events-auto">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-blue-950 border-blue-500/20 !z-[1000] pointer-events-auto">
                              <SelectItem value="none">No Sorting</SelectItem>
                              <SelectItem value="asc">Ascending ↑</SelectItem>
                              <SelectItem value="desc">Descending ↓</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Data Limit */}
                        <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-400/20 relative z-10">
                          <Label className="text-white mb-2 block">Data Points Limit</Label>
                          <Select 
                            value={limitData} 
                            onValueChange={(val) => {
                              setLimitData(val);
                            }}
                          >
                            <SelectTrigger className="bg-blue-900/30 border-blue-500/20 text-white relative z-10 pointer-events-auto">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-blue-950 border-blue-500/20 !z-[1000] pointer-events-auto">
                          <SelectItem value="all">All Data Points</SelectItem>
                          <SelectItem value="10">Top 10</SelectItem>
                          <SelectItem value="20">Top 20</SelectItem>
                          <SelectItem value="30">Top 30</SelectItem>
                          <SelectItem value="50">Top 50</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Clear Filters */}
                    <Button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSearchFilter('');
                        setMinValue('');
                        setMaxValue('');
                        setSortOrder('none');
                        setLimitData('all');
                      }}
                      variant="outline"
                      className="w-full bg-red-500/10 border-red-400/30 text-red-300 hover:bg-red-500/20 relative z-10 pointer-events-auto"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      <span className="text-xs">Clear All Filters</span>
                    </Button>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Right Column - Chart Visualization Output */}
              <div className="flex-1 flex flex-col min-w-0 h-full w-full">
                <div className="flex-1 p-4 sm:p-5 lg:p-6 rounded-xl bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/5 border border-blue-400/30 overflow-hidden backdrop-blur-sm flex flex-col h-full w-full">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 flex-shrink-0">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl sm:text-2xl text-white font-semibold mb-1 truncate">{chartTitle}</h3>
                      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-200 border-blue-400/30">
                          <Eye className="h-3 w-3 mr-1" />
                          {chartType.charAt(0).toUpperCase() + chartType.slice(1)}
                        </Badge>
                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 border-purple-400/30">
                          <Database className="h-3 w-3 mr-1" />
                          {dataSource.charAt(0).toUpperCase() + dataSource.slice(1)}
                        </Badge>
                        <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-200 border-emerald-400/30">
                          {dataStats.count} Points
                        </Badge>
                        {use3D && (
                          <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-200 border-cyan-400/30">
                            3D Mode
                          </Badge>
                        )}
                        <Badge variant="secondary" className="bg-orange-500/20 text-orange-200 border-orange-400/30">
                          {currency}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 w-full overflow-hidden relative" style={{ minHeight: '650px', height: '100%', width: '100%' }}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${chartType}-${dataSource}-${xAxis}-${yAxis}-${use3D}-${colorScheme}-${chartOpacity[0]}-${barRadius[0]}-${lineWidth[0]}-${searchFilter}-${sortOrder}-${limitData}-${chartData.length}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="w-full h-full absolute inset-0"
                      >
                        {chartData.length > 0 ? (
                          <div className="w-full h-full flex items-center justify-center" style={{ minHeight: '650px', width: '100%' }}>
                            {renderChart()}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center w-full h-full" style={{ minHeight: '650px' }}>
                            <p className="text-blue-300 text-lg">No data available. Please adjust your filters.</p>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    );
  }

}