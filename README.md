# OpenPI Visualization Client

A modern React + TypeScript visualization client for real-time model input monitoring with a compact dashboard layout.

## Features

- **Real-time WebSocket connection** with auto-reconnect
- **Compact 3-column dashboard** optimized for single-page viewing
- **Color-coded sections** for easy identification
  - 🔵 Metadata (left) - Training context and parameters
  - 🟣 Query Image (left) - Image used for ICL retrieval
  - 🟢 Observation Images (center) - Main model inputs
  - 🟠 ICL Examples (right) - In-context learning examples
- **Sticky header** with connection status
- **Scrollable ICL section** to handle multiple examples
- **Responsive design** that works on different screen sizes
- **Dark theme** optimized for long viewing sessions

## Quick Start

```bash
# Install dependencies (first time only)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Mock Mode (Development without Server)

You can develop and debug the UI without running the visualization server by enabling **Mock Mode**:

```bash
# Option 1: Add ?mock=true to the URL
http://localhost:5173/?mock=true

# Option 2: Enable via browser console
localStorage.setItem('mockMode', 'true')
# Then refresh the page

# To disable mock mode
localStorage.removeItem('mockMode')
```

Mock mode provides realistic sample data so you can:

- Design and test UI layouts
- Debug styling and responsiveness
- Develop new features without backend dependency
- Create screenshots and demos

When mock mode is active, you'll see a **Mock Mode** badge in the header.

## Usage Guide

### 1. Start the Visualization Server

First, start your training with visualization enabled:

```bash
CUDA_VISIBLE_DEVICES=0 \
XLA_PYTHON_CLIENT_MEM_FRACTION=0.6 \
XLA_PYTHON_CLIENT_PREALLOCATE=false \
XLA_PYTHON_CLIENT_ALLOCATOR=platform \
uv run scripts/train.py pi05_droid_finetune_icl --exp-name=exp_1 --no-wandb-enabled
```

The training script will start a visualization server on `ws://localhost:8765`.

### 2. Open the Visualization Client

```bash
cd visualizations
npm run dev
```

Then open <http://localhost:5173> in your browser.

### 3. Understanding the Dashboard

**Dashboard Layout:**

```
┌─────────────────────────────────────────────────────────────────┐
│  📊 OpenPI Live Visualization              ● Connected          │  ← Sticky Header
├────────────┬──────────────────────────────┬─────────────────────┤
│            │                              │                     │
│ 🔵 Metadata │  🟢 Observation Images      │  🟠 ICL Examples    │
│  • prompt  │   base_0_rgb                │  Example 1         │
│  • ...     │   ┌──────────┐              │  ┌─────┐           │
│            │   │  Image   │              │  │ Img │           │
│ 🟣 Query   │   └──────────┘              │  └─────┘           │
│ ┌────────┐ │                              │  Example 2         │
│ │  Image │ │   left_wrist_0_rgb          │  ┌─────┐ ↕ Scroll  │
│ └────────┘ │   ┌──────────┐              │  │ Img │           │
│            │   │  Image   │              │  └─────┘           │
│            │   └──────────┘              │  ...               │
│            │                              │                     │
└────────────┴──────────────────────────────┴─────────────────────┘
 25% width        42% width                     33% width
```

**Top Bar (Sticky)**

- **Title**: "OpenPI Live Visualization"
- **Connection Status**: Shows real-time WebSocket connection state
  - 🟡 Connecting...
  - 🟢 Connected
  - ⚫ Disconnected (auto-reconnects)
  - 🔴 Error

**Left Column (25% width)**

- **Metadata Card**: Shows training metadata like prompts, number of ICL examples, etc.
- **Query Image Card**: Displays the image used for retrieving ICL examples (not fed to the model)

**Middle Column (42% width)**

- **Observation Images Card**: Shows the main images being fed to the model
  - Typically includes: `base_0_rgb`, `left_wrist_0_rgb`, `right_wrist_0_rgb`
  - These are stacked vertically for easy comparison

**Right Column (33% width)**

- **ICL Examples Card**: Shows retrieved in-context learning examples
  - Each example shows its prompt and images
  - Scrollable to handle multiple examples
  - Compact layout to fit more examples on screen

### 4. Tips for Best Viewing Experience

- **Screen Size**: Works best on screens ≥ 1400px wide
- **Browser Zoom**: Adjust browser zoom (Ctrl/Cmd +/-) to fit your monitor
- **ICL Scrolling**: Use mouse wheel or trackpad to scroll through ICL examples in the right column
- **Full Screen**: Press F11 for full-screen mode to maximize viewing area

## Architecture

- **React 18** - UI library with hooks
- **TypeScript** - Type safety
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icon system

## Key Components

### App.tsx

Main dashboard with 3-column responsive grid layout.

### useWebSocket Hook

Manages WebSocket connection, automatic reconnection, and data streaming.

### ConnectionStatus

Displays real-time connection state with animated icons.

## Extending the Dashboard

The dashboard is designed to be easily extended:

```typescript
// Add a new section to the dashboard
<div className="col-span-12 lg:col-span-3 space-y-4">
  {/* Your new visualization component */}
</div>
```

Common additions:

- Action predictions display
- Real-time loss/metrics charts
- Model attention visualizations
- Frame rate / throughput metrics
- Recording controls

## Troubleshooting

**No connection?**

- Ensure the training script is running with visualization enabled
- Check that the server is on `ws://localhost:8765`
- Check browser console for WebSocket errors

**Layout looks cramped?**

- Try zooming out your browser (Ctrl/Cmd -)
- Maximize your browser window
- Check if you're on a screen ≥ 1400px wide

**Images not loading?**

- Check browser console for errors
- Verify the visualization server is sending data
- Try refreshing the page (Ctrl/Cmd + R)

## Development

```bash
# Start dev server with hot reload
npm run dev

# Type check
npm run build

# Format code (if you add prettier)
npm run format
```

## Production Deployment

```bash
# Build optimized bundle
npm run build

# Files will be in dist/
# Serve with any static file server
npx serve dist
```
