# vla-viz

Real-time visualization dashboard for monitoring Vision-Language-Action model inputs during training and inference.

## Features

- Live WebSocket connection to training server (default: `ws://localhost:8765`)
- View observation images, query images, and ICL examples in real-time
- Timeline navigation with history playback
- Mock mode for development (`?mock=true`)

## Quick Start

```bash
npm install
npm run dev
```
