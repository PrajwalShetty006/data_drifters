import { motion } from 'motion/react';
import { Card } from './ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { customerSegments } from '../data/mockData';
import { useDashboard, formatCurrency } from '../context/DashboardContext';
import { useFilters } from '../context/FilterContext';
import { useMemo } from 'react';
import { Maximize2 } from 'lucide-react';
import { BarChart3D } from './Chart3D';

interface CustomerSegmentChartProps {
  onExpand: () => void;
}

export function CustomerSegmentChart({ onExpand }: CustomerSegmentChartProps) {
  const { is3DMode, currency } = useDashboard();
  const { filters, applyFilters } = useFilters();
  
  // Apply filters to customer segments
  const filteredSegments = useMemo(() => {
    if (!filters.metrics.segments) return [];
    return applyFilters(customerSegments, 'segment');
  }, [filters, applyFilters]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="border-blue-500/20 bg-gradient-to-br from-blue-950/70 to-blue-900/40 backdrop-blur-sm h-full">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
            <div>
              <h2 className="text-lg sm:text-xl text-white mb-1">
                Customer Segmentation {is3DMode && <span className="text-cyan-400 text-sm">(3D)</span>}
              </h2>
              <p className="text-xs sm:text-sm text-blue-200/70">RFM-Based Customer Groups</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onExpand}
              className="px-3 sm:px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-400/30 text-blue-300 hover:bg-blue-500/30 transition-all text-sm flex items-center gap-2"
            >
              <Maximize2 className="h-4 w-4" />
              <span className="hidden sm:inline">Detailed View</span>
              <span className="sm:hidden">Details</span>
            </motion.button>
          </div>

          {filteredSegments.length === 0 ? (
            <div className="flex items-center justify-center h-[400px] text-blue-300">
              <p>Segment data is hidden by filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="h-[250px] sm:h-[300px]">
                <p className="text-xs sm:text-sm text-blue-200/70 mb-3 sm:mb-4 text-center">Distribution by Customer Count</p>
                {is3DMode ? (
                  <div style={{ transform: 'perspective(1000px) rotateX(15deg) rotateY(-10deg)', transformStyle: 'preserve-3d' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={filteredSegments}
                          dataKey="count"
                          nameKey="segment"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        innerRadius={30}
                        label={({ segment, percent }) => `${segment}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                        style={{
                          filter: 'drop-shadow(0px 8px 16px rgba(0, 0, 0, 0.5))',
                        }}
                      >
                        {filteredSegments.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '12px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={filteredSegments}
                      dataKey="count"
                      nameKey="segment"
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      label={({ segment, percent }) => `${segment}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {filteredSegments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="h-[250px] sm:h-[300px]">
              <p className="text-xs sm:text-sm text-blue-200/70 mb-3 sm:mb-4 text-center">Revenue by Segment</p>
              {is3DMode ? (
                <BarChart3D
                  data={filteredSegments}
                  dataKey="revenue"
                  xKey="segment"
                  height={250}
                  color="#0ea5e9"
                />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredSegments}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis 
                      dataKey="segment" 
                      stroke="#94a3b8"
                      tick={{ fill: '#94a3b8', fontSize: 9 }}
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
                      formatter={(value: number) => [formatCurrency(value, currency), 'Revenue']}
                    />
                    <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
                      {filteredSegments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
          )}
          
          {filteredSegments.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-4 sm:mt-6">
            {filteredSegments.map((segment) => (
              <div key={segment.segment} className="p-2 sm:p-3 rounded-lg bg-blue-500/10 border border-blue-400/20">
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0" style={{ backgroundColor: segment.color }} />
                  <p className="text-[10px] sm:text-xs text-blue-200/70 line-clamp-1">{segment.segment}</p>
                </div>
                <p className="text-base sm:text-lg text-white font-semibold">{segment.count}</p>
                <p className="text-[10px] sm:text-xs text-blue-300/60">customers</p>
              </div>
            ))}
          </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
