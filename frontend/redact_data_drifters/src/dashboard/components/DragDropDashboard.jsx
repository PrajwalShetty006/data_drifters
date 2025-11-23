import { useState, useRef } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { motion } from 'motion/react';
import { SalesForecastChart } from './SalesForecastChart';
import { CustomerSegmentChart } from './CustomerSegmentChart';
import { TargetedOffersPanel } from './TargetedOffersPanel';
import { MetricCard } from './MetricCard';
import { SimpleSummary } from './SimpleSummary';
import { GripVertical, X, Maximize2, Copy, Download } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useData } from '@/context/DataContext';
import html2canvas from 'html2canvas';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const DEFAULT_LAYOUTS = {
  lg: [
    { i: 'forecast', x: 0, y: 0, w: 12, h: 8, minW: 6, minH: 6 },
    { i: 'segments', x: 0, y: 8, w: 6, h: 8, minW: 4, minH: 6 },
    { i: 'offers', x: 6, y: 8, w: 6, h: 8, minW: 4, minH: 6 },
    { i: 'metric-0', x: 0, y: 16, w: 2, h: 3, minW: 2, minH: 3 },
    { i: 'metric-1', x: 2, y: 16, w: 2, h: 3, minW: 2, minH: 3 },
    { i: 'metric-2', x: 4, y: 16, w: 2, h: 3, minW: 2, minH: 3 },
    { i: 'metric-3', x: 6, y: 16, w: 2, h: 3, minW: 2, minH: 3 },
    { i: 'metric-4', x: 8, y: 16, w: 2, h: 3, minW: 2, minH: 3 },
    { i: 'summary', x: 0, y: 19, w: 12, h: 6, minW: 6, minH: 4 },
  ],
  md: [
    { i: 'forecast', x: 0, y: 0, w: 10, h: 8, minW: 6, minH: 6 },
    { i: 'segments', x: 0, y: 8, w: 5, h: 8, minW: 4, minH: 6 },
    { i: 'offers', x: 5, y: 8, w: 5, h: 8, minW: 4, minH: 6 },
    { i: 'metric-0', x: 0, y: 16, w: 2, h: 3, minW: 2, minH: 3 },
    { i: 'metric-1', x: 2, y: 16, w: 2, h: 3, minW: 2, minH: 3 },
    { i: 'metric-2', x: 4, y: 16, w: 2, h: 3, minW: 2, minH: 3 },
    { i: 'metric-3', x: 6, y: 16, w: 2, h: 3, minW: 2, minH: 3 },
    { i: 'metric-4', x: 8, y: 16, w: 2, h: 3, minW: 2, minH: 3 },
    { i: 'summary', x: 0, y: 19, w: 10, h: 6, minW: 6, minH: 4 },
  ],
  sm: [
    { i: 'forecast', x: 0, y: 0, w: 6, h: 8, minW: 6, minH: 6 },
    { i: 'segments', x: 0, y: 8, w: 6, h: 8, minW: 6, minH: 6 },
    { i: 'offers', x: 0, y: 16, w: 6, h: 8, minW: 6, minH: 6 },
    { i: 'metric-0', x: 0, y: 24, w: 3, h: 3, minW: 2, minH: 3 },
    { i: 'metric-1', x: 3, y: 24, w: 3, h: 3, minW: 2, minH: 3 },
    { i: 'metric-2', x: 0, y: 27, w: 3, h: 3, minW: 2, minH: 3 },
    { i: 'metric-3', x: 3, y: 27, w: 3, h: 3, minW: 2, minH: 3 },
    { i: 'metric-4', x: 0, y: 30, w: 6, h: 3, minW: 2, minH: 3 },
    { i: 'summary', x: 0, y: 33, w: 6, h: 6, minW: 6, minH: 4 },
  ],
};

export function DragDropDashboard({ comparisonMode = false }) {
  const { theme } = useTheme();
  const { metrics, transformedForecast } = useData();
  const [layouts, setLayouts] = useState(DEFAULT_LAYOUTS);
  
  // Create metric cards from API data
  const metricCards = [
    {
      id: 'total-revenue',
      title: 'Avg Daily Sales',
      value: `$${((metrics.avgDailySales || 0) / 1000).toFixed(1)}k`,
      change: metrics.growthRate || 0,
      icon: 'DollarSign',
      data: transformedForecast.slice(0, 8).map(f => f.forecast / 1000),
    },
    {
      id: 'forecast-trend',
      title: 'Forecast Trend',
      value: `${(metrics.growthRate || 0) >= 0 ? '+' : ''}${(metrics.growthRate || 0).toFixed(1)}%`,
      change: metrics.growthRate || 0,
      icon: 'TrendingUp',
      data: transformedForecast.slice(0, 8).map(f => f.forecast / 1000),
    },
    {
      id: 'customer-segments',
      title: 'Total Customers',
      value: `${(metrics.totalCustomers || 0).toLocaleString()}`,
      change: 12.5,
      icon: 'Users',
      data: [],
    },
    {
      id: 'best-performers',
      title: 'Total Revenue',
      value: `$${((metrics.totalRevenue || 0) / 1000000).toFixed(1)}M`,
      change: metrics.growthRate || 0,
      icon: 'Target',
      data: transformedForecast.slice(0, 8).map(f => f.forecast / 1000),
    },
  ];
  const [widgets, setWidgets] = useState([
    'forecast', 'segments', 'offers', 
    'metric-0', 'metric-1', 'metric-2', 'metric-3', 'metric-4',
    'summary'
  ]);
  const dashboardRef = useRef(null);

  const handleLayoutChange = (layout, allLayouts) => {
    setLayouts(allLayouts);
  };

  const removeWidget = (widgetId) => {
    setWidgets(widgets.filter(w => w !== widgetId));
  };

  const duplicateWidget = (widgetId) => {
    const newId = `${widgetId}-copy-${Date.now()}`;
    setWidgets([...widgets, newId]);
    
    // Add to layout
    const currentLayout = layouts.lg.find(l => l.i === widgetId);
    if (currentLayout) {
      const newLayout = {
        ...currentLayout,
        i: newId,
        x: (currentLayout.x + 2) % 12,
        y: currentLayout.y + currentLayout.h,
      };
      setLayouts({
        ...layouts,
        lg: [...layouts.lg, newLayout],
        md: [...layouts.md, { ...newLayout, w: Math.min(newLayout.w, 10) }],
        sm: [...layouts.sm, { ...newLayout, w: 6 }],
      });
    }
  };

  const exportWidget = async (widgetId) => {
    const element = document.getElementById(widgetId);
    if (element) {
      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = `${widgetId}-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const exportDashboard = async () => {
    if (dashboardRef.current) {
      const canvas = await html2canvas(dashboardRef.current, {
        backgroundColor: null,
        scale: 2,
        width: dashboardRef.current.scrollWidth,
        height: dashboardRef.current.scrollHeight,
      });
      const link = document.createElement('a');
      link.download = `dashboard-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const resetLayout = () => {
    setLayouts(DEFAULT_LAYOUTS);
    setWidgets([
      'forecast', 'segments', 'offers', 
      'metric-0', 'metric-1', 'metric-2', 'metric-3', 'metric-4',
      'summary'
    ]);
  };

  const renderWidget = (widgetId) => {
    const baseId = widgetId.split('-copy-')[0];
    
    switch (baseId) {
      case 'forecast':
        return <SalesForecastChart />;
      case 'segments':
        return <CustomerSegmentChart />;
      case 'offers':
        return <TargetedOffersPanel />;
      case 'summary':
        return <SimpleSummary />;
      default:
        if (baseId.startsWith('metric-')) {
          const index = parseInt(baseId.split('-')[1]);
          const card = metricCards[index];
          return card ? <MetricCard {...card} /> : null;
        }
        return null;
    }
  };

  return (
    <div className="relative">
      {/* Dashboard Controls */}
      <div className="mb-4 flex flex-wrap gap-2 justify-end">
        <Button
          onClick={resetLayout}
          size="sm"
          variant="outline"
          className={`${theme.buttonBg} ${theme.buttonBorder} ${theme.buttonText}`}
        >
          Reset Layout
        </Button>
        <Button
          onClick={exportDashboard}
          size="sm"
          className={`bg-gradient-to-r ${theme.accent} text-white`}
        >
          <Download className="h-4 w-4 mr-2" />
          Export Dashboard
        </Button>
      </div>

      <div ref={dashboardRef} className="relative">
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768 }}
          cols={{ lg: 12, md: 10, sm: 6 }}
          rowHeight={30}
          onLayoutChange={handleLayoutChange}
          draggableHandle=".drag-handle"
          compactType="vertical"
          preventCollision={false}
        >
          {widgets.map((widgetId) => (
            <div
              key={widgetId}
              id={widgetId}
              className={`${theme.cardBg} ${theme.cardBorder} border rounded-lg backdrop-blur-sm overflow-hidden shadow-lg hover:shadow-2xl transition-shadow`}
            >
              {/* Widget Header */}
              <div className={`flex items-center justify-between p-2 border-b ${theme.cardBorder} bg-gradient-to-r ${theme.buttonBg}`}>
                <div className="drag-handle cursor-move flex items-center gap-2">
                  <GripVertical className={`h-4 w-4 ${theme.textSecondary}`} />
                  <span className={`text-xs ${theme.textSecondary}`}>
                    {widgetId.replace('-copy-', ' (Copy ').replace(/copy-\d+/, ')')}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => duplicateWidget(widgetId)}
                    className={`p-1 hover:bg-blue-500/20 rounded transition-colors ${theme.textSecondary}`}
                    title="Duplicate"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => exportWidget(widgetId)}
                    className={`p-1 hover:bg-blue-500/20 rounded transition-colors ${theme.textSecondary}`}
                    title="Export as Image"
                  >
                    <Download className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => removeWidget(widgetId)}
                    className={`p-1 hover:bg-red-500/20 rounded transition-colors ${theme.textSecondary}`}
                    title="Remove"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Widget Content */}
              <div className="h-[calc(100%-40px)] overflow-auto p-2">
                {renderWidget(widgetId)}
              </div>
            </div>
          ))}
        </ResponsiveGridLayout>
      </div>
    </div>
  );
}
