import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import { FilterProvider, useFilters } from './context/FilterContext';
import { DataProvider, useData } from '@/context/DataContext';
import { MetricCard } from './components/MetricCard';
import { SalesForecastChart } from './components/SalesForecastChart';
import { CustomerSegmentChart } from './components/CustomerSegmentChart';
import { TargetedOffersPanel } from './components/TargetedOffersPanel';
import { AIAssistant } from './components/AIAssistant';
import { DetailedAnalysisModal } from './components/DetailedAnalysisModal';
import { FilterSidebar } from './components/FilterSidebar';
import { CustomChartBuilder } from './components/CustomChartBuilder';
import { SimpleSummary } from './components/SimpleSummary';
import { CustomizationPanel } from './components/CustomizationPanel';
import { Chart3DViewer } from './components/Chart3DViewer';
import { UserAccount } from './components/UserAccount';
import { Bot, Filter, Printer, Download, Settings } from 'lucide-react';
import { Button } from './components/ui/button';
import './styles/globals.css';

function DashboardContent() {
  const { gridLayout } = useDashboard();
  const { filters } = useFilters();
  const { metrics, transformedForecast, transformedSegments, loading } = useData();
  const [aiOpen, setAiOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [customizationOpen, setCustomizationOpen] = useState(false);
  const [customChartOpen, setCustomChartOpen] = useState(false);
  const [chart3DOpen, setChart3DOpen] = useState(false);
  
  // Create metric cards from API data
  const metricCards = useMemo(() => {
    const forecastData = transformedForecast.slice(0, 8).map(f => f.forecast / 1000);
    const avgDailySales = metrics.avgDailySales || 0;
    const growthRate = metrics.growthRate || 0;
    const totalCustomers = metrics.totalCustomers || 0;
    const totalRevenue = metrics.totalRevenue || 0;

    return [
      {
        id: 'total-revenue',
        title: 'Avg Daily Sales',
        value: `$${(avgDailySales / 1000).toFixed(1)}k`,
        change: growthRate,
        icon: 'DollarSign',
        data: forecastData,
        order: 0,
      },
      {
        id: 'forecast-trend',
        title: 'Forecast Trend',
        value: `${growthRate >= 0 ? '+' : ''}${growthRate.toFixed(1)}%`,
        change: growthRate,
        icon: 'TrendingUp',
        data: forecastData,
        order: 1,
      },
      {
        id: 'customer-segments',
        title: 'Total Customers',
        value: `${totalCustomers.toLocaleString()}`,
        change: 12.5,
        icon: 'Users',
        data: [totalCustomers * 0.8, totalCustomers * 0.9, totalCustomers],
        order: 2,
      },
      {
        id: 'best-performers',
        title: 'Total Revenue',
        value: `$${(totalRevenue / 1000000).toFixed(1)}M`,
        change: growthRate,
        icon: 'Target',
        data: forecastData,
        order: 3,
      },
    ];
  }, [metrics, transformedForecast]);

  // Filter metric cards based on filter context
  const filteredMetricCards = useMemo(() => {
    return metricCards.filter((card) => {
      if (card.id === 'total-revenue' && !filters.metrics.revenue) return false;
      if (card.id === 'forecast-trend' && !filters.metrics.forecast) return false;
      if (card.id === 'customer-segments' && !filters.metrics.segments) return false;
      if (card.id === 'best-performers' && !filters.metrics.segments) return false;
      return true;
    });
  }, [filters.metrics, metricCards]);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'forecast' | 'segments' | 'metric' | null;
    title: string;
  }>({
    isOpen: false,
    type: null,
    title: '',
  });

  const handlePrintReport = () => {
    window.print();
  };

  const handleDownloadData = () => {
    const dataStr = JSON.stringify({
      forecast: 'Sales forecast data',
      segments: 'Customer segments',
      timestamp: new Date().toISOString(),
    }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'chainforecast-report.json';
    link.click();
  };

  const openModal = (type: 'forecast' | 'segments' | 'metric', title: string) => {
    setModalState({ isOpen: true, type, title });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-cyan-500/10 rounded-full blur-3xl"
        />
      </div>

      <FilterSidebar isOpen={filterOpen} onClose={() => setFilterOpen(false)} />
      <AIAssistant isOpen={aiOpen} onClose={() => setAiOpen(false)} />
      <CustomizationPanel 
        isOpen={customizationOpen} 
        onClose={() => setCustomizationOpen(false)}
      />

      <div className={`transition-all duration-300 ${filterOpen ? 'lg:ml-80' : 'ml-0'} ${aiOpen ? 'lg:mr-96' : 'mr-0'}`}>
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl text-white mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-bold">
                  ChainForecast
                </h1>
                <p className="text-sm sm:text-base text-blue-200/70">AI-Powered Sales Forecasting & Customer Relationship Management</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 sm:flex-initial">
                  <Button
                    onClick={() => setFilterOpen(!filterOpen)}
                    variant="outline"
                    className="w-full sm:w-auto bg-blue-500/20 border-blue-400/30 text-blue-300 hover:bg-blue-500/30"
                    size="sm"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Filters</span>
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 sm:flex-initial">
                  <Button
                    onClick={() => setCustomizationOpen(!customizationOpen)}
                    variant="outline"
                    className="w-full sm:w-auto bg-blue-500/20 border-blue-400/30 text-blue-300 hover:bg-blue-500/30"
                    size="sm"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Customize</span>
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 sm:flex-initial">
                  <Button
                    onClick={() => setAiOpen(!aiOpen)}
                    variant="outline"
                    className="w-full sm:w-auto bg-blue-500/20 border-blue-400/30 text-blue-300 hover:bg-blue-500/30"
                    size="sm"
                  >
                    <Bot className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">AI</span>
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden md:block">
                  <Button
                    onClick={handleDownloadData}
                    variant="outline"
                    className="bg-blue-500/20 border-blue-400/30 text-blue-300 hover:bg-blue-500/30"
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handlePrintReport}
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-none hover:from-blue-600 hover:to-cyan-600"
                    size="sm"
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Report
                  </Button>
                </motion.div>

                {/* User Account Dropdown */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <UserAccount />
                </motion.div>
              </div>
            </div>

            <div className="h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-full" />
          </motion.div>

          {/* Metric Cards */}
          {filteredMetricCards.length > 0 && (
            <div className={`grid gap-3 sm:gap-4 mb-4 sm:mb-6 ${
              gridLayout === 'compact' 
                ? 'grid-cols-2 lg:grid-cols-5' 
                : gridLayout === 'wide'
                ? 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5'
            }`}>
              {filteredMetricCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <MetricCard
                  {...card}
                  onClick={() => openModal('metric', card.title)}
                />
              </motion.div>
              ))}
            </div>
          )}

          {/* Main Content Grid */}
          {(filters.metrics.forecast || filters.metrics.segments || filters.metrics.offers) && (
            <div className={`grid gap-4 sm:gap-6 ${
              gridLayout === 'compact' 
                ? 'grid-cols-1' 
                : gridLayout === 'wide'
                ? 'grid-cols-1 xl:grid-cols-2'
                : 'grid-cols-1'
            }`}>
              {/* Main Chart - Sales Forecast */}
              {filters.metrics.forecast && (
                <div className={gridLayout === 'wide' ? 'xl:col-span-2' : ''}>
                  <SalesForecastChart 
                    onExpand={() => openModal('forecast', '4-Week Sales Forecast - Detailed Analysis')}
                  />
                </div>
              )}

              {/* Secondary Charts Grid */}
              <div className={`grid gap-4 sm:gap-6 ${
                gridLayout === 'compact' 
                  ? 'grid-cols-1 lg:grid-cols-2' 
                  : gridLayout === 'wide'
                  ? 'grid-cols-1'
                  : 'grid-cols-1 lg:grid-cols-2'
              } ${gridLayout === 'wide' ? 'xl:col-span-2' : ''}`}>
                {filters.metrics.segments && (
                  <CustomerSegmentChart 
                    onExpand={() => openModal('segments', 'Customer Segmentation - Detailed View')}
                  />
                )}
                {filters.metrics.offers && (
                  <TargetedOffersPanel 
                    onExpand={() => openModal('segments', 'Targeted Offers & Recommendations')} 
                  />
                )}
              </div>
            </div>
          )}

          {/* Simple Summary Section */}
          <SimpleSummary />

          {/* Footer Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 sm:mt-8 p-4 sm:p-6 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-400/20 backdrop-blur-sm"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
              <div>
                <p className="text-xs sm:text-sm text-blue-200/70 mb-1">Data Points Analyzed</p>
                <p className="text-xl sm:text-2xl text-white font-semibold">
                  {transformedForecast.length > 0 ? transformedForecast.length : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-blue-200/70 mb-1">Model Accuracy</p>
                <p className="text-xl sm:text-2xl text-white font-semibold">High</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-blue-200/70 mb-1">Active Customers</p>
                <p className="text-xl sm:text-2xl text-white font-semibold">
                  {transformedSegments.reduce((sum, s) => sum + (s.count || 0), 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-blue-200/70 mb-1">Last Updated</p>
                <p className="text-xl sm:text-2xl text-white font-semibold">Just now</p>
              </div>
            </div>
          </motion.div>

          {/* Custom Chart Builder Section at Bottom */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 sm:mt-8 w-full"
          >
            <CustomChartBuilder isOpen={false} onClose={() => {}} />
          </motion.div>
        </div>
      </div>

      <DetailedAnalysisModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, type: null, title: '' })}
        type={modalState.type}
        title={modalState.title}
      />

      <CustomChartBuilder
        isOpen={customChartOpen}
        onClose={() => setCustomChartOpen(false)}
      />

      <Chart3DViewer
        isOpen={chart3DOpen}
        onClose={() => setChart3DOpen(false)}
      />

      {/* Print styles */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <DataProvider>
        <DashboardProvider>
          <FilterProvider>
            <DashboardContent />
          </FilterProvider>
        </DashboardProvider>
      </DataProvider>
    </div>
  );
}

