import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DashboardContextType {
  gridLayout: string;
  setGridLayout: (layout: string) => void;
  is3DMode: boolean;
  setIs3DMode: (mode: boolean) => void;
  currency: string;
  setCurrency: (currency: string) => void;
  exchangeRate: number;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const currencyRates: Record<string, { symbol: string; rate: number }> = {
  USD: { symbol: '$', rate: 1 },
  EUR: { symbol: '€', rate: 0.92 },
  GBP: { symbol: '£', rate: 0.79 },
  INR: { symbol: '₹', rate: 83.12 },
  JPY: { symbol: '¥', rate: 149.50 },
  AUD: { symbol: 'A$', rate: 1.52 },
  CAD: { symbol: 'C$', rate: 1.36 },
};

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [gridLayout, setGridLayout] = useState('default');
  const [is3DMode, setIs3DMode] = useState(false);
  const [currency, setCurrency] = useState('USD');

  const exchangeRate = currencyRates[currency]?.rate || 1;

  return (
    <DashboardContext.Provider
      value={{
        gridLayout,
        setGridLayout,
        is3DMode,
        setIs3DMode,
        currency,
        setCurrency,
        exchangeRate,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}

export function formatCurrency(value: number, currency: string): string {
  const rate = currencyRates[currency]?.rate || 1;
  const symbol = currencyRates[currency]?.symbol || '$';
  const converted = value * rate;
  
  if (converted >= 1000000) {
    return `${symbol}${(converted / 1000000).toFixed(2)}M`;
  } else if (converted >= 1000) {
    return `${symbol}${(converted / 1000).toFixed(1)}k`;
  }
  return `${symbol}${converted.toFixed(0)}`;
}
