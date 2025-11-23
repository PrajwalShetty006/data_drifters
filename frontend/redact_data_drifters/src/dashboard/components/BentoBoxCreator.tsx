import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { SalesForecastChart } from './SalesForecastChart';
import { CustomerSegmentChart } from './CustomerSegmentChart';
import { TargetedOffersPanel } from './TargetedOffersPanel';
import { MetricCard } from './MetricCard';
import { useData } from '@/context/DataContext';
import { 
  Grid3x3, Download, FileImage, FileText, Palette, 
  LayoutGrid, Sparkles, Image as ImageIcon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import html2canvas from 'html2canvas';

interface BentoCell {
  id: number;
  span: string;
}

interface BentoLayout {
  name: string;
  preview: string;
  grid: string;
  cells: BentoCell[];
}

type BentoLayouts = {
  [key: string]: BentoLayout;
};

interface BentoContent {
  id: string;
  name: string;
  type: string;
}

interface BentoBoxCreatorProps {
  isOpen: boolean;
  onClose: () => void;
}

const BENTO_LAYOUTS: BentoLayouts = {
  classic: {
    name: 'Classic Grid',
    preview: '2x2',
    grid: 'grid-cols-2 grid-rows-2',
    cells: [
      { id: 1, span: 'col-span-1 row-span-1' },
      { id: 2, span: 'col-span-1 row-span-1' },
      { id: 3, span: 'col-span-1 row-span-1' },
      { id: 4, span: 'col-span-1 row-span-1' },
    ]
  },
  hero: {
    name: 'Hero Layout',
    preview: 'Hero + 3',
    grid: 'grid-cols-2 grid-rows-2',
    cells: [
      { id: 1, span: 'col-span-2 row-span-1' },
      { id: 2, span: 'col-span-1 row-span-1' },
      { id: 3, span: 'col-span-1 row-span-1' },
    ]
  },
  magazine: {
    name: 'Magazine',
    preview: 'Mixed',
    grid: 'grid-cols-3 grid-rows-3',
    cells: [
      { id: 1, span: 'col-span-2 row-span-2' },
      { id: 2, span: 'col-span-1 row-span-1' },
      { id: 3, span: 'col-span-1 row-span-1' },
      { id: 4, span: 'col-span-1 row-span-1' },
      { id: 5, span: 'col-span-2 row-span-1' },
    ]
  },
  masonry: {
    name: 'Masonry',
    preview: '3 Col',
    grid: 'grid-cols-3 grid-rows-4',
    cells: [
      { id: 1, span: 'col-span-1 row-span-2' },
      { id: 2, span: 'col-span-1 row-span-1' },
      { id: 3, span: 'col-span-1 row-span-1' },
      { id: 4, span: 'col-span-1 row-span-1' },
      { id: 5, span: 'col-span-1 row-span-2' },
      { id: 6, span: 'col-span-1 row-span-1' },
    ]
  },
  spotlight: {
    name: 'Spotlight',
    preview: 'Featured',
    grid: 'grid-cols-4 grid-rows-3',
    cells: [
      { id: 1, span: 'col-span-1 row-span-1' },
      { id: 2, span: 'col-span-2 row-span-2' },
      { id: 3, span: 'col-span-1 row-span-1' },
      { id: 4, span: 'col-span-1 row-span-1' },
      { id: 5, span: 'col-span-1 row-span-1' },
      { id: 6, span: 'col-span-2 row-span-1' },
    ]
  },
};

const AVAILABLE_CONTENT: BentoContent[] = [
  { id: 'forecast', name: 'Sales Forecast', type: 'chart' },
  { id: 'segments', name: 'Customer Segments', type: 'chart' },
  { id: 'offers', name: 'Targeted Offers', type: 'panel' },
  { id: 'metric-0', name: 'Avg Daily Sales', type: 'metric' },
  { id: 'metric-1', name: 'Forecast Trend', type: 'metric' },
  { id: 'metric-2', name: 'Customer Groups', type: 'metric' },
  { id: 'metric-3', name: 'VIP Customers', type: 'metric' },
  { id: 'metric-4', name: 'Peak Sales Day', type: 'metric' },
  { id: 'stat-customers', name: 'Total Customers', type: 'stat' },
  { id: 'stat-revenue', name: 'Total Revenue', type: 'stat' },
];

export function BentoBoxCreator({ isOpen, onClose }: BentoBoxCreatorProps) {
  const { theme, customColors } = useTheme();
  const { metrics, transformedSegments, transformedForecast } = useData();
  const [selectedLayout, setSelectedLayout] = useState<string>('classic');
  const [cellContents, setCellContents] = useState<{ [key: number]: string }>({});
  const [bentoTitle, setBentoTitle] = useState('ChainForecast Dashboard');
  const [bentoSubtitle, setBentoSubtitle] = useState('AI-Powered Analytics');
  const [backgroundColor, setBackgroundColor] = useState(customColors.primary);
  const [exportFormat, setExportFormat] = useState<'png' | 'jpg' | 'ppt'>('png');
  const bentoRef = useRef<HTMLDivElement>(null);

  const layout = BENTO_LAYOUTS[selectedLayout];

  const handleCellContentChange = (cellId: number, contentId: string) => {
    setCellContents({ ...cellContents, [cellId]: contentId });
  };

  const renderCellContent = (contentId: string | undefined) => {
    if (!contentId) {
      return (
        <div className="h-full flex items-center justify-center">
          <p className={`text-sm ${theme.textSecondary}`}>Select content</p>
        </div>
      );
    }

    const baseId = contentId.split('-')[0];
    
    switch (baseId) {
      case 'forecast':
        return <SalesForecastChart onExpand={() => {}} />;
      case 'segments':
        return <CustomerSegmentChart onExpand={() => {}} />;
      case 'offers':
        return <TargetedOffersPanel />;
      case 'metric':
        const metricIndex = parseInt(contentId.split('-')[1]);
        // Create metric cards from API data
        const growthRate = metrics.growthRate || 0;
        const growthDisplay = growthRate >= 0 ? `+${growthRate.toFixed(1)}%` : `${growthRate.toFixed(1)}%`;
        const metricCards = [
          { title: 'Avg Daily Sales', value: `$${(metrics.avgDailySales || 0).toFixed(0)}`, trend: growthDisplay },
          { title: 'Total Revenue', value: `$${((metrics.totalRevenue || 0) / 1000).toFixed(1)}k`, trend: growthDisplay },
          { title: 'VIP Customers', value: `${transformedSegments.find(s => s.segment === 'VIP Customer')?.count || 0}`, trend: growthDisplay },
          { title: 'Forecast Confidence', value: transformedForecast.length > 0 ? 'High' : 'N/A', trend: 'Stable' },
        ];
        if (metricCards[metricIndex]) {
          return <MetricCard {...metricCards[metricIndex]} />;
        }
        return null;
      case 'stat':
        if (contentId === 'stat-customers') {
          const totalCustomers = transformedSegments.reduce((sum, s) => sum + (s.count || 0), 0);
          return (
            <div className="h-full flex flex-col items-center justify-center">
              <p className={`text-4xl font-bold ${theme.text} mb-2`}>
                {totalCustomers.toLocaleString()}
              </p>
              <p className={`text-sm ${theme.textSecondary}`}>Total Customers</p>
            </div>
          );
        }
        if (contentId === 'stat-revenue') {
          return (
            <div className="h-full flex flex-col items-center justify-center">
              <p className={`text-4xl font-bold ${theme.text} mb-2`}>
                ${((metrics.totalRevenue || 0) / 1000).toFixed(0)}k
              </p>
              <p className={`text-sm ${theme.textSecondary}`}>Total Revenue</p>
            </div>
          );
        }
        return null;
      default:
        return null;
    }
  };

  const exportBento = async () => {
    if (bentoRef.current) {
      const canvas = await html2canvas(bentoRef.current, {
        backgroundColor: backgroundColor,
        scale: 3,
        logging: false,
      });

      if (exportFormat === 'png') {
        const link = document.createElement('a');
        link.download = `bento-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } else if (exportFormat === 'jpg') {
        const link = document.createElement('a');
        link.download = `bento-${Date.now()}.jpg`;
        link.href = canvas.toDataURL('image/jpeg', 0.95);
        link.click();
      } else if (exportFormat === 'ppt') {
        // For PPT, we'll create a high-res image with metadata
        const link = document.createElement('a');
        link.download = `bento-presentation-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        alert('Image exported! You can now insert this into PowerPoint.');
      }
    }
  };

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
                    <LayoutGrid className="h-6 w-6 text-blue-400" />
                  </div>
                  Bento Box Creator
                </DialogTitle>
                <DialogDescription className={`text-sm ${theme.textSecondary} mt-2`}>
                  Create beautiful dashboard presentations for PowerPoint and reports
                </DialogDescription>
              </div>
              <div className="flex gap-2">
                <Select value={exportFormat} onValueChange={(value) => setExportFormat(value as 'png' | 'jpg' | 'ppt')}>
                  <SelectTrigger className={`w-32 ${theme.inputBg} ${theme.inputBorder}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={`${theme.cardBg} ${theme.cardBorder}`}>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="jpg">JPG</SelectItem>
                    <SelectItem value="ppt">For PPT</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={exportBento}
                  size="sm"
                  className={`bg-gradient-to-r ${theme.accent} text-white`}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export {exportFormat.toUpperCase()}
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-6 h-full">
              {/* Left Sidebar - Configuration */}
              <div className="col-span-3 overflow-y-auto space-y-4">
                {/* Title Settings */}
                <div className={`p-4 rounded-lg ${theme.cardBg} ${theme.cardBorder} border`}>
                  <h3 className={`font-semibold mb-3 ${theme.text}`}>Title Settings</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className={`text-sm ${theme.textSecondary} mb-1 block`}>Main Title</Label>
                      <Input
                        value={bentoTitle}
                        onChange={(e) => setBentoTitle(e.target.value)}
                        className={`${theme.inputBg} ${theme.inputBorder} ${theme.text}`}
                      />
                    </div>
                    <div>
                      <Label className={`text-sm ${theme.textSecondary} mb-1 block`}>Subtitle</Label>
                      <Input
                        value={bentoSubtitle}
                        onChange={(e) => setBentoSubtitle(e.target.value)}
                        className={`${theme.inputBg} ${theme.inputBorder} ${theme.text}`}
                      />
                    </div>
                    <div>
                      <Label className={`text-sm ${theme.textSecondary} mb-1 block`}>Background Color</Label>
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-full h-10 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Layout Selection */}
                <div className={`p-4 rounded-lg ${theme.cardBg} ${theme.cardBorder} border`}>
                  <h3 className={`font-semibold mb-3 ${theme.text} flex items-center gap-2`}>
                    <Grid3x3 className="h-4 w-4" />
                    Layout Style
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(BENTO_LAYOUTS).map(([key, layout]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedLayout(key)}
                        className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                          selectedLayout === key
                            ? `border-blue-400 ${theme.buttonBg}`
                            : `${theme.cardBorder} hover:bg-blue-500/5`
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-medium ${theme.text}`}>{layout.name}</span>
                          <Badge variant="secondary" className={`text-xs ${theme.buttonBg}`}>
                            {layout.preview}
                          </Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cell Content Assignment */}
                <div className={`p-4 rounded-lg ${theme.cardBg} ${theme.cardBorder} border`}>
                  <h3 className={`font-semibold mb-3 ${theme.text} flex items-center gap-2`}>
                    <Sparkles className="h-4 w-4" />
                    Cell Content
                  </h3>
                  <div className="space-y-3">
                    {layout.cells.map((cell) => (
                      <div key={cell.id}>
                        <Label className={`text-xs ${theme.textSecondary} mb-1 block`}>
                          Cell {cell.id}
                        </Label>
                        <Select
                          value={cellContents[cell.id] || ''}
                          onValueChange={(value) => handleCellContentChange(cell.id, value)}
                        >
                          <SelectTrigger className={`${theme.inputBg} ${theme.inputBorder} ${theme.text} text-xs`}>
                            <SelectValue placeholder="Select content" />
                          </SelectTrigger>
                          <SelectContent className={`${theme.cardBg} ${theme.cardBorder}`}>
                            {AVAILABLE_CONTENT.map((content) => (
                              <SelectItem key={content.id} value={content.id}>
                                {content.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side - Bento Preview */}
              <div className="col-span-9 overflow-auto">
                <div
                  ref={bentoRef}
                  className="p-8 rounded-xl"
                  style={{
                    backgroundColor: backgroundColor,
                    minHeight: '800px',
                  }}
                >
                  {/* Bento Header */}
                  <div className="mb-6 text-center">
                    <h1 className="text-4xl font-bold text-white mb-2">{bentoTitle}</h1>
                    <p className="text-lg text-white/80">{bentoSubtitle}</p>
                  </div>

                  {/* Bento Grid */}
                  <div className={`grid ${layout.grid} gap-4 h-[700px]`}>
                    {layout.cells.map((cell) => (
                      <motion.div
                        key={cell.id}
                        className={`${cell.span} bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-2xl overflow-hidden`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: cell.id * 0.1 }}
                      >
                        {renderCellContent(cellContents[cell.id])}
                      </motion.div>
                    ))}
                  </div>

                  {/* Bento Footer */}
                  <div className="mt-6 text-center">
                    <p className="text-sm text-white/60">
                      Generated by ChainForecast • {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
