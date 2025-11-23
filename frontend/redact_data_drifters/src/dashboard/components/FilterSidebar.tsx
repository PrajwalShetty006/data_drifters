import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { Filter, X, RefreshCw, Check } from 'lucide-react';
import { useFilters } from '../context/FilterContext';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FilterSidebar({ isOpen, onClose }: FilterSidebarProps) {
  const { 
    filters, 
    updateDateRange, 
    updateSegments, 
    updateMetrics, 
    updateTimePeriod,
    resetFilters 
  } = useFilters();

  const handleReset = () => {
    resetFilters();
  };

  const handleApplyFilters = () => {
    // Filters are applied automatically via context
    // Just close the sidebar
    onClose();
  };

  const handleSegmentChange = (segment: keyof typeof filters.segments, checked: boolean) => {
    updateSegments({
      ...filters.segments,
      [segment]: checked,
    });
  };

  const handleMetricChange = (metric: keyof typeof filters.metrics, checked: boolean) => {
    updateMetrics({
      ...filters.metrics,
      [metric]: checked,
    });
  };

  const handleTimePeriodClick = (period: string) => {
    // Toggle if already selected
    updateTimePeriod(filters.timePeriod === period ? null : period);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      transition={{ type: 'spring', damping: 25 }}
      className="fixed left-0 top-0 bottom-0 w-full sm:w-80 z-40 overflow-hidden"
    >
      <Card className="h-full border-r border-blue-500/20 bg-gradient-to-br from-blue-950/98 to-blue-900/95 backdrop-blur-md rounded-none">
        <div className="p-4 sm:p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/30">
                <Filter className="h-5 w-5 text-blue-400" />
              </div>
              <h2 className="text-xl text-white">Filters & Options</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-blue-300 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6 pr-2">
            {/* Date Range */}
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-400/20">
              <h3 className="text-white mb-4">📅 Date Range</h3>
              <div className="space-y-4">
                <Slider
                  value={filters.dateRange}
                  onValueChange={(value) => updateDateRange(value as [number, number])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-blue-200/70">
                  <span>{filters.dateRange[0]}% past</span>
                  <span>{filters.dateRange[1]}% future</span>
                </div>
              </div>
            </div>

            {/* Customer Segments */}
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-400/20">
              <h3 className="text-white mb-4">👥 Customer Segments</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="vip-customer"
                    checked={filters.segments.vipCustomer}
                    onCheckedChange={(checked) => 
                      handleSegmentChange('vipCustomer', checked as boolean)
                    }
                    className="border-blue-400/50"
                  />
                  <Label htmlFor="vip-customer" className="text-blue-100 cursor-pointer flex-1">
                    <span className="text-base">VIP Customer</span>
                    <span className="text-xs text-blue-300/60 block">450 customers</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="frequent-buyer"
                    checked={filters.segments.frequentBuyer}
                    onCheckedChange={(checked) => 
                      handleSegmentChange('frequentBuyer', checked as boolean)
                    }
                    className="border-blue-400/50"
                  />
                  <Label htmlFor="frequent-buyer" className="text-blue-100 cursor-pointer flex-1">
                    <span className="text-base">Frequent Buyer</span>
                    <span className="text-xs text-blue-300/60 block">1,200 customers</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="at-risk"
                    checked={filters.segments.atRisk}
                    onCheckedChange={(checked) => 
                      handleSegmentChange('atRisk', checked as boolean)
                    }
                    className="border-blue-400/50"
                  />
                  <Label htmlFor="at-risk" className="text-blue-100 cursor-pointer flex-1">
                    <span className="text-base">At Risk Customer</span>
                    <span className="text-xs text-blue-300/60 block">800 customers</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="new-low-value"
                    checked={filters.segments.newLowValue}
                    onCheckedChange={(checked) => 
                      handleSegmentChange('newLowValue', checked as boolean)
                    }
                    className="border-blue-400/50"
                  />
                  <Label htmlFor="new-low-value" className="text-blue-100 cursor-pointer flex-1">
                    <span className="text-base">New/Low Value</span>
                    <span className="text-xs text-blue-300/60 block">600 customers</span>
                  </Label>
                </div>
              </div>
            </div>

            {/* Metrics Display */}
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-400/20">
              <h3 className="text-white mb-4">📊 Metrics Display</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="revenue" 
                    checked={filters.metrics.revenue}
                    onCheckedChange={(checked) => 
                      handleMetricChange('revenue', checked as boolean)
                    }
                    className="border-blue-400/50"
                  />
                  <Label htmlFor="revenue" className="text-blue-100 cursor-pointer">
                    Revenue Metrics
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="forecast" 
                    checked={filters.metrics.forecast}
                    onCheckedChange={(checked) => 
                      handleMetricChange('forecast', checked as boolean)
                    }
                    className="border-blue-400/50"
                  />
                  <Label htmlFor="forecast" className="text-blue-100 cursor-pointer">
                    Forecast Data
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="segments-display" 
                    checked={filters.metrics.segments}
                    onCheckedChange={(checked) => 
                      handleMetricChange('segments', checked as boolean)
                    }
                    className="border-blue-400/50"
                  />
                  <Label htmlFor="segments-display" className="text-blue-100 cursor-pointer">
                    Segment Analysis
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="offers" 
                    checked={filters.metrics.offers}
                    onCheckedChange={(checked) => 
                      handleMetricChange('offers', checked as boolean)
                    }
                    className="border-blue-400/50"
                  />
                  <Label htmlFor="offers" className="text-blue-100 cursor-pointer">
                    Targeted Offers
                  </Label>
                </div>
              </div>
            </div>

            {/* Time Period */}
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-400/20">
              <h3 className="text-white mb-4">⏰ Time Period</h3>
              <div className="grid grid-cols-2 gap-2">
                {['Last Week', 'Last Month', 'Last Quarter', 'Last Year'].map((period) => (
                  <Button
                    key={period}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleTimePeriodClick(period)}
                    className={`text-xs ${
                      filters.timePeriod === period
                        ? 'bg-blue-500/30 border-blue-400/50 text-white'
                        : 'bg-blue-500/10 border-blue-400/20 text-blue-300 hover:bg-blue-500/20'
                    }`}
                  >
                    {period}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-blue-500/20 pt-4 mt-4 space-y-2">
            <Button
              onClick={handleApplyFilters}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600"
            >
              <Check className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="w-full bg-blue-500/10 border-blue-400/30 text-blue-300 hover:bg-blue-500/20"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Filters
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
