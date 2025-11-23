import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Settings, X, Layout, Grid3x3, Maximize2, Box, DollarSign } from 'lucide-react';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useDashboard, currencyRates } from '../context/DashboardContext';

interface CustomizationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CustomizationPanel({ 
  isOpen, 
  onClose,
}: CustomizationPanelProps) {
  const { gridLayout, setGridLayout, is3DMode, setIs3DMode, currency, setCurrency } = useDashboard();

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md"
      >
        <Card className="border-blue-500/20 bg-gradient-to-br from-blue-950/95 to-blue-900/90 backdrop-blur-md">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/30">
                  <Settings className="h-5 w-5 text-blue-400" />
                </div>
                <h2 className="text-xl text-white">Dashboard Customization</h2>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClose();
                }}
                className="text-blue-300 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Currency Selection */}
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-400/20">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="h-5 w-5 text-blue-400" />
                  <Label className="text-white">Currency</Label>
                </div>
                <Select 
                  value={currency} 
                  onValueChange={(val) => {
                    setCurrency(val);
                  }}
                >
                  <SelectTrigger className="w-full bg-blue-900/30 border-blue-500/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-blue-950 border-blue-500/20">
                    {Object.entries(currencyRates).map(([code, { symbol }]) => (
                      <SelectItem key={code} value={code}>
                        {code} ({symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-blue-200/70 mt-2">
                  All monetary values will be converted to selected currency
                </p>
              </div>

              {/* 3D Mode Toggle */}
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-400/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Box className="h-5 w-5 text-blue-400" />
                    <Label className="text-white">3D Chart Mode</Label>
                  </div>
                  <Switch
                    checked={is3DMode}
                    onCheckedChange={(checked) => {
                      setIs3DMode(checked);
                    }}
                  />
                </div>
                <p className="text-sm text-blue-200/70">
                  {is3DMode ? '3D visualization enabled with depth effects' : 'Enable 3D visualization for charts'}
                </p>
              </div>

              {/* Grid Layout */}
              <div>
                <h3 className="text-white mb-3 flex items-center gap-2">
                  <Layout className="h-4 w-4 text-blue-400" />
                  Grid Layout
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setGridLayout('default');
                    }}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      gridLayout === 'default'
                        ? 'border-blue-400 bg-blue-500/20'
                        : 'border-blue-400/20 bg-blue-500/10 hover:bg-blue-500/15'
                    }`}
                  >
                    <Layout className="h-6 w-6 text-blue-300 mx-auto mb-2" />
                    <p className="text-xs text-blue-200">Default</p>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setGridLayout('compact');
                    }}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      gridLayout === 'compact'
                        ? 'border-blue-400 bg-blue-500/20'
                        : 'border-blue-400/20 bg-blue-500/10 hover:bg-blue-500/15'
                    }`}
                  >
                    <Grid3x3 className="h-6 w-6 text-blue-300 mx-auto mb-2" />
                    <p className="text-xs text-blue-200">Compact</p>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setGridLayout('wide');
                    }}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      gridLayout === 'wide'
                        ? 'border-blue-400 bg-blue-500/20'
                        : 'border-blue-400/20 bg-blue-500/10 hover:bg-blue-500/15'
                    }`}
                  >
                    <Maximize2 className="h-6 w-6 text-blue-300 mx-auto mb-2" />
                    <p className="text-xs text-blue-200">Wide</p>
                  </button>
                </div>
              </div>

              {/* Current Settings Info */}
              <div className="p-4 rounded-lg bg-gradient-to-r from-cyan-500/10 to-transparent border border-cyan-400/20">
                <h4 className="text-white mb-2 text-sm font-semibold">Current Settings</h4>
                <div className="space-y-1 text-xs text-blue-200/70">
                  <p>• Layout: <span className="text-white">{gridLayout}</span></p>
                  <p>• 3D Mode: <span className="text-white">{is3DMode ? 'Enabled' : 'Disabled'}</span></p>
                  <p>• Currency: <span className="text-white">{currency} ({currencyRates[currency].symbol})</span></p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-blue-500/20 flex gap-3">
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClose();
                }}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600"
              >
                Done
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setGridLayout('default');
                  setIs3DMode(false);
                  setCurrency('USD');
                }}
                className="flex-1 bg-transparent border-blue-400/30 text-blue-300 hover:bg-blue-500/10"
              >
                Reset to Default
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
