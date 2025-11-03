import type { VisualizationData } from '../types';

// Sample base64 placeholder images (1x1 pixel colored images for demonstration)
const createPlaceholderImage = (color: string) => {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 640, 480);
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Mock Image', 320, 240);
  }
  return canvas.toDataURL();
};

export const mockVisualizationData: VisualizationData = {
  timestamp: Date.now(),
  metadata: {
    prompt: "Pick up the red block and place it in the box",
    num_icl_examples: 3,
    icl_prompts: [
      "Pick up the blue cup",
      "Move the yellow toy",
      "Grasp the green marker"
    ],
    episode: 42,
    step: 127,
    scene: "kitchen_table_01"
  },
  query_image: createPlaceholderImage('#8B5CF6'), // Purple
  observation_images: {
    'camera_front': createPlaceholderImage('#10B981'), // Green
    'camera_wrist': createPlaceholderImage('#3B82F6'), // Blue
    'camera_top': createPlaceholderImage('#F59E0B')   // Orange
  },
  icl_images: [
    {
      'observation': createPlaceholderImage('#EF4444'), // Red
      'action': createPlaceholderImage('#EC4899')       // Pink
    },
    {
      'observation': createPlaceholderImage('#06B6D4'), // Cyan
      'action': createPlaceholderImage('#8B5CF6')       // Purple
    },
    {
      'observation': createPlaceholderImage('#F97316'), // Orange
      'action': createPlaceholderImage('#84CC16')       // Lime
    }
  ]
};

// Function to simulate periodic data updates (optional)
export const generateMockData = (): VisualizationData => {
  return {
    ...mockVisualizationData,
    timestamp: Date.now(),
    metadata: {
      ...mockVisualizationData.metadata,
      step: Math.floor(Math.random() * 500),
      episode: Math.floor(Math.random() * 100)
    }
  };
};
