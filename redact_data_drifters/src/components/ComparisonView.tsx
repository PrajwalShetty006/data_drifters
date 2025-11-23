import { useState } from 'react';
import { motion } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { SalesForecastChart } from './SalesForecastChart';
import { CustomerSegmentChart } from './CustomerSegmentChart';
import { TargetedOffersPanel } from './TargetedOffersPanel';
import { ArrowLeftRight, Download, Maximize2, Minimize2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import html2canvas from 'html2canvas';

interface Widget {
  id: string;
  name: string;
  component: () => JSX.Element;
}

interface ComparisonViewProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVAILABLE_WIDGETS: Widget[] = [
  { id: 'forecast', name: 'Sales Forecast', component: SalesForecastChart },
  { id: 'segments', name: 'Customer Segments', component: CustomerSegmentChart },
  { id: 'offers', name: 'Targeted Offers', component: TargetedOffersPanel },
];

export function ComparisonView({ isOpen, onClose }: ComparisonViewProps) {
  const { theme } = useTheme();
  const [leftWidget, setLeftWidget] = useState('forecast');
  const [rightWidget, setRightWidget] = useState('segments');
  const [splitRatio, setSplitRatio] = useState(50);
  const [viewMode, setViewMode] = useState<'horizontal' | 'vertical' | 'quad'>('horizontal');

  const exportComparison = async () => {
    const element = document.getElementById('comparison-view');
    if (element) {
      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = `comparison-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const LeftComponent = AVAILABLE_WIDGETS.find(w => w.id === leftWidget)?.component;
  const RightComponent = AVAILABLE_WIDGETS.find(w => w.id === rightWidget)?.component;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-[98vw] w-[98vw] max-h-[98vh] h-[98vh] overflow-hidden ${theme.cardBg} ${theme.cardBorder} border ${theme.text} p-0`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className={`px-6 pt-6 pb-4 border-b ${theme.cardBorder} flex-shrink-0`}>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${theme.buttonBg} ${theme.buttonBorder} border`}>
                    <ArrowLeftRight className="h-6 w-6 text-blue-400" />
                  </div>
                  Comparison View
                </DialogTitle>
                <p className={`text-sm ${theme.textSecondary} mt-2`}>
                  Compare multiple visualizations side by side
                </p>
              </div>
              <div className="flex gap-2">
                <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'horizontal' | 'vertical' | 'quad')}>
                  <TabsList className={`${theme.buttonBg} ${theme.buttonBorder} border`}>
                    <TabsTrigger value="horizontal">Horizontal</TabsTrigger>
                    <TabsTrigger value="vertical">Vertical</TabsTrigger>
                    <TabsTrigger value="quad">Quad</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button
                  onClick={exportComparison}
                  size="sm"
                  className={`bg-gradient-to-r ${theme.accent} text-white`}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Controls */}
          <div className={`px-6 py-3 border-b ${theme.cardBorder} flex gap-4 items-center flex-wrap`}>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${theme.textSecondary}`}>Left:</span>
              <Select value={leftWidget} onValueChange={setLeftWidget}>
                <SelectTrigger className={`w-48 ${theme.inputBg} ${theme.inputBorder} ${theme.text}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={`${theme.cardBg} ${theme.cardBorder}`}>
                  {AVAILABLE_WIDGETS.map(widget => (
                    <SelectItem key={widget.id} value={widget.id}>
                      {widget.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {viewMode !== 'quad' && (
              <>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${theme.textSecondary}`}>Split:</span>
                  <input
                    type="range"
                    min="20"
                    max="80"
                    value={splitRatio}
                    onChange={(e) => setSplitRatio(Number(e.target.value))}
                    className="w-32"
                  />
                  <Badge variant="secondary" className={`${theme.buttonBg} ${theme.buttonText}`}>
                    {splitRatio}%
                  </Badge>
                </div>
              </>
            )}

            <div className="flex items-center gap-2">
              <span className={`text-sm ${theme.textSecondary}`}>Right:</span>
              <Select value={rightWidget} onValueChange={setRightWidget}>
                <SelectTrigger className={`w-48 ${theme.inputBg} ${theme.inputBorder} ${theme.text}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={`${theme.cardBg} ${theme.cardBorder}`}>
                  {AVAILABLE_WIDGETS.map(widget => (
                    <SelectItem key={widget.id} value={widget.id}>
                      {widget.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Comparison Content */}
          <div id="comparison-view" className="flex-1 p-6 overflow-hidden">
            {viewMode === 'horizontal' && (
              <div className="flex h-full gap-4">
                <motion.div
                  className={`${theme.cardBg} ${theme.cardBorder} border rounded-lg p-4 overflow-auto`}
                  style={{ width: `${splitRatio}%` }}
                  layout
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className={`font-semibold ${theme.text}`}>
                      {AVAILABLE_WIDGETS.find(w => w.id === leftWidget)?.name}
                    </h3>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                      Left Panel
                    </Badge>
                  </div>
                  <div className="h-[calc(100%-40px)]">
                    {LeftComponent && <LeftComponent />}
                  </div>
                </motion.div>

                <motion.div
                  className={`${theme.cardBg} ${theme.cardBorder} border rounded-lg p-4 overflow-auto`}
                  style={{ width: `${100 - splitRatio}%` }}
                  layout
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className={`font-semibold ${theme.text}`}>
                      {AVAILABLE_WIDGETS.find(w => w.id === rightWidget)?.name}
                    </h3>
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                      Right Panel
                    </Badge>
                  </div>
                  <div className="h-[calc(100%-40px)]">
                    {RightComponent && <RightComponent />}
                  </div>
                </motion.div>
              </div>
            )}

            {viewMode === 'vertical' && (
              <div className="flex flex-col h-full gap-4">
                <motion.div
                  className={`${theme.cardBg} ${theme.cardBorder} border rounded-lg p-4 overflow-auto`}
                  style={{ height: `${splitRatio}%` }}
                  layout
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className={`font-semibold ${theme.text}`}>
                      {AVAILABLE_WIDGETS.find(w => w.id === leftWidget)?.name}
                    </h3>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                      Top Panel
                    </Badge>
                  </div>
                  <div className="h-[calc(100%-40px)]">
                    {LeftComponent && <LeftComponent />}
                  </div>
                </motion.div>

                <motion.div
                  className={`${theme.cardBg} ${theme.cardBorder} border rounded-lg p-4 overflow-auto`}
                  style={{ height: `${100 - splitRatio}%` }}
                  layout
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className={`font-semibold ${theme.text}`}>
                      {AVAILABLE_WIDGETS.find(w => w.id === rightWidget)?.name}
                    </h3>
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                      Bottom Panel
                    </Badge>
                  </div>
                  <div className="h-[calc(100%-40px)]">
                    {RightComponent && <RightComponent />}
                  </div>
                </motion.div>
              </div>
            )}

            {viewMode === 'quad' && (
              <div className="grid grid-cols-2 gap-4 h-full">
                <div className={`${theme.cardBg} ${theme.cardBorder} border rounded-lg p-4 overflow-auto`}>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className={`font-semibold ${theme.text}`}>Sales Forecast</h3>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">1</Badge>
                  </div>
                  <div className="h-[calc(100%-40px)]">
                    <SalesForecastChart />
                  </div>
                </div>

                <div className={`${theme.cardBg} ${theme.cardBorder} border rounded-lg p-4 overflow-auto`}>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className={`font-semibold ${theme.text}`}>Customer Segments</h3>
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">2</Badge>
                  </div>
                  <div className="h-[calc(100%-40px)]">
                    <CustomerSegmentChart />
                  </div>
                </div>

                <div className={`${theme.cardBg} ${theme.cardBorder} border rounded-lg p-4 overflow-auto`}>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className={`font-semibold ${theme.text}`}>Targeted Offers</h3>
                    <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-300">3</Badge>
                  </div>
                  <div className="h-[calc(100%-40px)]">
                    <TargetedOffersPanel />
                  </div>
                </div>

                <div className={`${theme.cardBg} ${theme.cardBorder} border rounded-lg p-4 overflow-auto`}>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className={`font-semibold ${theme.text}`}>
                      {AVAILABLE_WIDGETS.find(w => w.id === rightWidget)?.name}
                    </h3>
                    <Badge variant="secondary" className="bg-orange-500/20 text-orange-300">4</Badge>
                  </div>
                  <div className="h-[calc(100%-40px)]">
                    {RightComponent && <RightComponent />}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
