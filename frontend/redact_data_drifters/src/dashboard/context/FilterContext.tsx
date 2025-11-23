import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface FilterState {
  dateRange: [number, number];
  segments: {
    vipCustomer: boolean;
    frequentBuyer: boolean;
    atRisk: boolean;
    newLowValue: boolean;
  };
  metrics: {
    revenue: boolean;
    forecast: boolean;
    segments: boolean;
    offers: boolean;
  };
  timePeriod: string | null;
}

interface FilterContextType {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  updateDateRange: (range: [number, number]) => void;
  updateSegments: (segments: FilterState['segments']) => void;
  updateMetrics: (metrics: FilterState['metrics']) => void;
  updateTimePeriod: (period: string | null) => void;
  resetFilters: () => void;
  applyFilters: (data: any[], segmentField?: string) => any[];
}

const defaultFilters: FilterState = {
  dateRange: [0, 100],
  segments: {
    vipCustomer: true,
    frequentBuyer: true,
    atRisk: true,
    newLowValue: true,
  },
  metrics: {
    revenue: true,
    forecast: true,
    segments: true,
    offers: true,
  },
  timePeriod: null,
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const updateDateRange = (range: [number, number]) => {
    setFilters(prev => ({ ...prev, dateRange: range }));
  };

  const updateSegments = (segments: FilterState['segments']) => {
    setFilters(prev => ({ ...prev, segments }));
  };

  const updateMetrics = (metrics: FilterState['metrics']) => {
    setFilters(prev => ({ ...prev, metrics }));
  };

  const updateTimePeriod = (period: string | null) => {
    setFilters(prev => ({ ...prev, timePeriod: period }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  // Apply filters to data - memoized function
  const applyFilters = React.useCallback((data: any[], segmentField: string = 'segment') => {
    let filteredData = [...data];

    // Apply segment filters
    const activeSegments: string[] = [];
    if (filters.segments.vipCustomer) activeSegments.push('VIP Customer');
    if (filters.segments.frequentBuyer) activeSegments.push('Frequent Buyer');
    if (filters.segments.atRisk) activeSegments.push('At Risk Customer');
    if (filters.segments.newLowValue) activeSegments.push('New/Low Value Customer');

    if (activeSegments.length > 0 && activeSegments.length < 4) {
      filteredData = filteredData.filter((item: any) => {
        const segment = item[segmentField] || item.segment;
        return activeSegments.includes(segment);
      });
    }

    // Apply date range filter (for forecast data with dates)
    if (data.length > 0 && data[0].week) {
      const totalItems = data.length;
      const startIndex = Math.floor((filters.dateRange[0] / 100) * totalItems);
      const endIndex = Math.ceil((filters.dateRange[1] / 100) * totalItems);
      filteredData = filteredData.slice(startIndex, endIndex);
    }

    return filteredData;
  }, [filters.segments, filters.dateRange]);

  return (
    <FilterContext.Provider
      value={{
        filters,
        setFilters,
        updateDateRange,
        updateSegments,
        updateMetrics,
        updateTimePeriod,
        resetFilters,
        applyFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}

