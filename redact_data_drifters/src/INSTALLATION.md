# ChainForecast Dashboard - Installation Guide

## 🚀 New Features Added

### ✨ What's New:
1. **Light/Dark Mode** - 5 beautiful themes (Dark, Light, Midnight, Sunset, Forest)
2. **Bento Box PPT Creator** - Create stunning presentation images
3. **Drag & Drop Dashboard** - Fully customizable resizable widgets
4. **Comparison View** - Compare visualizations side-by-side
5. **Theme Customizer** - Custom color palettes
6. **Resize & Rearrange** - Every widget is draggable and resizable
7. **Export Features** - Export individual widgets or entire dashboard

---

## 📦 Required Dependencies

You need to install these additional packages:

```bash
npm install react-grid-layout react-resizable html2canvas
```

Or with yarn:

```bash
yarn add react-grid-layout react-resizable html2canvas
```

### Dependencies Breakdown:
- **react-grid-layout** - Drag and drop dashboard functionality
- **react-resizable** - Resizable components
- **html2canvas** - Export dashboard/widgets as images

---

## 🎨 Features Guide

### 1. **Light/Dark Mode Toggle**
- Click the Sun/Moon icon in the header
- Quick switch between light and dark themes
- Or use the Theme Customizer for more options

### 2. **Theme Customizer**
- Access via "Themes" button
- 5 pre-built themes:
  - **Dark** - Classic blue dark theme
  - **Light** - Clean light theme
  - **Midnight** - Purple dark theme
  - **Sunset** - Orange/pink light theme
  - **Forest** - Emerald/teal dark theme
- Custom color picker for brand colors
- Preset color palettes

### 3. **Drag & Drop Dashboard**
- Switch to "Drag & Drop Dashboard" tab
- **Drag** - Click and hold the grip handle (≡) to move widgets
- **Resize** - Drag the bottom-right corner of any widget
- **Duplicate** - Click copy icon to create widget copies
- **Remove** - Click X to remove widgets
- **Export** - Download individual widgets or entire dashboard
- **Reset Layout** - Return to default arrangement

### 4. **Bento Box PPT Creator**
- Click "Bento PPT" button
- Choose from 5 layout styles:
  - Classic Grid (2x2)
  - Hero Layout
  - Magazine Layout
  - Masonry Grid
  - Spotlight Layout
- Customize:
  - Title and subtitle
  - Background color
  - Cell content (drag charts, metrics, stats)
- Export as PNG, JPG, or For PowerPoint
- Perfect for presentations and reports!

### 5. **Comparison View**
- Click "Compare" button
- 3 view modes:
  - **Horizontal** - Side-by-side comparison
  - **Vertical** - Top-bottom comparison
  - **Quad** - 4-panel comparison
- Adjustable split ratio
- Select different visualizations for each panel
- Export comparison as image

### 6. **Custom Chart Builder** (Enhanced)
- Build custom charts with:
  - 6 chart types
  - 4 data sources
  - Working filters
  - Custom styling
  - Export configurations

---

## 🎯 How to Use

### Basic Workflow:
1. **Explore** - Start with Grid View to see all widgets
2. **Customize** - Switch to Drag & Drop Dashboard
3. **Rearrange** - Move and resize widgets to your preference
4. **Theme** - Choose a theme or create custom colors
5. **Compare** - Use Comparison View for analysis
6. **Present** - Create Bento Box layouts for PowerPoint
7. **Export** - Download your customized dashboard

### Keyboard Shortcuts:
- Grid View: Better for quick overview
- Drag & Drop: Better for customization

---

## 🎨 Color Customization

### Custom Colors:
1. Click "Themes" button
2. Go to "Custom Colors" tab
3. Pick colors with color picker or enter HEX codes
4. Choose from preset palettes
5. Click "Apply Colors"

### Preset Palettes:
- **Ocean** - Blue tones
- **Sunset** - Orange/red
- **Forest** - Green/teal
- **Purple** - Purple/lavender

---

## 📤 Export Options

### Individual Widgets:
- Click download icon on any widget
- Exports as PNG image (2x resolution)

### Entire Dashboard:
- Click "Export Dashboard" in Drag & Drop view
- Captures complete layout

### Bento Box:
- PNG - High quality
- JPG - Smaller file size
- For PPT - Optimized for PowerPoint

### Comparison View:
- Export side-by-side comparisons
- Perfect for reports

---

## 💡 Tips & Tricks

1. **Responsive Design** - All layouts adapt to screen size
2. **Widget Duplication** - Quickly create multiple versions
3. **Reset Anytime** - Reset layout button restores defaults
4. **Theme Persistence** - Your theme choice is saved
5. **High Resolution** - All exports are 2-3x resolution for quality

---

## 🐛 Troubleshooting

### If widgets don't drag:
- Make sure you're grabbing the grip handle (≡)
- Check that you're in "Drag & Drop Dashboard" mode

### If export doesn't work:
- Make sure html2canvas is installed
- Check browser console for errors
- Try disabling browser extensions

### If themes don't apply:
- Refresh the page
- Clear browser cache
- Check ThemeProvider is wrapping App

---

## 📚 Component Structure

```
/App.jsx - Main application with tabs
/context/
  - DashboardContext.jsx - Dashboard state
  - ThemeContext.jsx - Theme management
/components/
  - DragDropDashboard.jsx - Drag & drop layout
  - ComparisonView.jsx - Side-by-side comparison
  - BentoBoxCreator.jsx - PPT image creator
  - ThemeCustomizer.jsx - Theme selector
  - CustomChartBuilder.jsx - Chart builder
  - [Other components...]
```

---

## 🎉 You're All Set!

Your ChainForecast Dashboard now has:
✅ Light & Dark modes
✅ 5 beautiful themes
✅ Drag & drop customization
✅ Resizable widgets
✅ Comparison views
✅ Bento Box PPT creator
✅ Custom color palettes
✅ Export capabilities

**Enjoy building amazing dashboards!** 🚀
