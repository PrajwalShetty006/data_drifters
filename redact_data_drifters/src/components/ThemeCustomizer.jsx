import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { useTheme, themes } from '../context/ThemeContext';
import { Palette, Sun, Moon, Sparkles, Check } from 'lucide-react';

export function ThemeCustomizer({ isOpen, onClose }) {
  const { currentTheme, setCurrentTheme, customColors, setCustomColors, theme } = useTheme();
  const [tempColors, setTempColors] = useState(customColors);

  const handleApplyColors = () => {
    setCustomColors(tempColors);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-2xl ${theme.cardBg} ${theme.cardBorder} border ${theme.text} p-0`}>
        <div className="flex flex-col h-full">
          <DialogHeader className={`px-6 pt-6 pb-4 border-b ${theme.cardBorder}`}>
            <DialogTitle className="text-2xl flex items-center gap-3">
              <div className={`p-2 rounded-lg ${theme.buttonBg} ${theme.buttonBorder} border`}>
                <Palette className="h-6 w-6 text-blue-400" />
              </div>
              Theme Customizer
            </DialogTitle>
            <DialogDescription className={`${theme.textSecondary}`}>
              Personalize your dashboard with themes and custom colors
            </DialogDescription>
          </DialogHeader>

          <div className="p-6">
            <Tabs defaultValue="themes">
              <TabsList className={`grid w-full grid-cols-2 ${theme.buttonBg} ${theme.buttonBorder} border mb-6`}>
                <TabsTrigger value="themes">
                  <Moon className="h-4 w-4 mr-2" />
                  Themes
                </TabsTrigger>
                <TabsTrigger value="colors">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Custom Colors
                </TabsTrigger>
              </TabsList>

              {/* Themes Tab */}
              <TabsContent value="themes" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(themes).map(([key, themeData]) => {
                    const isDark = ['dark', 'midnight', 'forest'].includes(key);
                    return (
                      <button
                        key={key}
                        onClick={() => setCurrentTheme(key)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          currentTheme === key
                            ? 'border-blue-400 ring-2 ring-blue-400/30'
                            : `${theme.cardBorder} hover:border-blue-400/50`
                        }`}
                      >
                        {/* Theme Preview */}
                        <div className={`h-24 rounded-lg mb-3 p-3 ${themeData.bg}`}>
                          <div className="flex gap-2 mb-2">
                            <div className={`h-2 w-8 rounded ${themeData.cardBg} ${themeData.cardBorder} border`} />
                            <div className={`h-2 w-12 rounded ${themeData.cardBg} ${themeData.cardBorder} border`} />
                          </div>
                          <div className={`h-10 rounded ${themeData.cardBg} ${themeData.cardBorder} border`} />
                        </div>

                        {/* Theme Info */}
                        <div className="flex items-center justify-between">
                          <div className="text-left">
                            <h3 className={`font-semibold ${theme.text}`}>{themeData.name}</h3>
                            <div className="flex items-center gap-1 mt-1">
                              {isDark ? (
                                <>
                                  <Moon className={`h-3 w-3 ${theme.textSecondary}`} />
                                  <span className={`text-xs ${theme.textSecondary}`}>Dark</span>
                                </>
                              ) : (
                                <>
                                  <Sun className={`h-3 w-3 ${theme.textSecondary}`} />
                                  <span className={`text-xs ${theme.textSecondary}`}>Light</span>
                                </>
                              )}
                            </div>
                          </div>
                          {currentTheme === key && (
                            <div className="bg-blue-500 rounded-full p-1">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Theme Description */}
                <div className={`p-4 rounded-lg ${theme.cardBg} ${theme.cardBorder} border`}>
                  <h4 className={`font-semibold mb-2 ${theme.text}`}>Current Theme: {themes[currentTheme].name}</h4>
                  <p className={`text-sm ${theme.textSecondary}`}>
                    {currentTheme === 'dark' && 'Classic dark theme with blue accents, perfect for extended viewing sessions.'}
                    {currentTheme === 'light' && 'Clean light theme with excellent readability for daytime use.'}
                    {currentTheme === 'midnight' && 'Deep purple theme for a premium, sophisticated look.'}
                    {currentTheme === 'sunset' && 'Warm orange and pink gradients for an energetic feel.'}
                    {currentTheme === 'forest' && 'Calm emerald and teal tones for a natural, balanced aesthetic.'}
                  </p>
                </div>
              </TabsContent>

              {/* Custom Colors Tab */}
              <TabsContent value="colors" className="space-y-4">
                <div className={`p-4 rounded-lg ${theme.cardBg} ${theme.cardBorder} border`}>
                  <h4 className={`font-semibold mb-4 ${theme.text}`}>Custom Color Palette</h4>
                  
                  <div className="space-y-4">
                    {/* Primary Color */}
                    <div>
                      <Label className={`${theme.textSecondary} mb-2 block`}>Primary Color</Label>
                      <div className="flex gap-3 items-center">
                        <input
                          type="color"
                          value={tempColors.primary}
                          onChange={(e) => setTempColors({ ...tempColors, primary: e.target.value })}
                          className="w-16 h-16 rounded-lg cursor-pointer border-2 border-white/20"
                        />
                        <div className="flex-1">
                          <input
                            type="text"
                            value={tempColors.primary}
                            onChange={(e) => setTempColors({ ...tempColors, primary: e.target.value })}
                            className={`w-full px-3 py-2 rounded-lg ${theme.inputBg} ${theme.inputBorder} ${theme.text} border font-mono`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Secondary Color */}
                    <div>
                      <Label className={`${theme.textSecondary} mb-2 block`}>Secondary Color</Label>
                      <div className="flex gap-3 items-center">
                        <input
                          type="color"
                          value={tempColors.secondary}
                          onChange={(e) => setTempColors({ ...tempColors, secondary: e.target.value })}
                          className="w-16 h-16 rounded-lg cursor-pointer border-2 border-white/20"
                        />
                        <div className="flex-1">
                          <input
                            type="text"
                            value={tempColors.secondary}
                            onChange={(e) => setTempColors({ ...tempColors, secondary: e.target.value })}
                            className={`w-full px-3 py-2 rounded-lg ${theme.inputBg} ${theme.inputBorder} ${theme.text} border font-mono`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Accent Color */}
                    <div>
                      <Label className={`${theme.textSecondary} mb-2 block`}>Accent Color</Label>
                      <div className="flex gap-3 items-center">
                        <input
                          type="color"
                          value={tempColors.accent}
                          onChange={(e) => setTempColors({ ...tempColors, accent: e.target.value })}
                          className="w-16 h-16 rounded-lg cursor-pointer border-2 border-white/20"
                        />
                        <div className="flex-1">
                          <input
                            type="text"
                            value={tempColors.accent}
                            onChange={(e) => setTempColors({ ...tempColors, accent: e.target.value })}
                            className={`w-full px-3 py-2 rounded-lg ${theme.inputBg} ${theme.inputBorder} ${theme.text} border font-mono`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-2">
                    <Button
                      onClick={handleApplyColors}
                      className={`flex-1 bg-gradient-to-r ${theme.accent} text-white`}
                    >
                      Apply Colors
                    </Button>
                    <Button
                      onClick={() => setTempColors({
                        primary: '#0ea5e9',
                        secondary: '#06b6d4',
                        accent: '#3b82f6',
                      })}
                      variant="outline"
                      className={`${theme.buttonBg} ${theme.buttonBorder} ${theme.buttonText}`}
                    >
                      Reset
                    </Button>
                  </div>
                </div>

                {/* Preset Color Palettes */}
                <div className={`p-4 rounded-lg ${theme.cardBg} ${theme.cardBorder} border`}>
                  <h4 className={`font-semibold mb-3 ${theme.text}`}>Preset Palettes</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'Ocean', colors: { primary: '#0ea5e9', secondary: '#06b6d4', accent: '#3b82f6' } },
                      { name: 'Sunset', colors: { primary: '#f59e0b', secondary: '#f97316', accent: '#ef4444' } },
                      { name: 'Forest', colors: { primary: '#10b981', secondary: '#14b8a6', accent: '#22c55e' } },
                      { name: 'Purple', colors: { primary: '#8b5cf6', secondary: '#a78bfa', accent: '#c084fc' } },
                    ].map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => setTempColors(preset.colors)}
                        className={`p-3 rounded-lg border ${theme.cardBorder} hover:border-blue-400/50 transition-all`}
                      >
                        <div className="flex gap-1 mb-2">
                          <div className="flex-1 h-6 rounded" style={{ backgroundColor: preset.colors.primary }} />
                          <div className="flex-1 h-6 rounded" style={{ backgroundColor: preset.colors.secondary }} />
                          <div className="flex-1 h-6 rounded" style={{ backgroundColor: preset.colors.accent }} />
                        </div>
                        <span className={`text-sm ${theme.text}`}>{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
