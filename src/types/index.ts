export interface VisualizationData {
  timestamp: number;
  metadata: {
    prompt?: string;
    num_icl_examples?: number;
    icl_prompts?: string[];
    [key: string]: unknown;
  };
  query_image?: string;
  observation_images?: Record<string, string>;
  icl_images?: Array<Record<string, string>>;
}

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';
