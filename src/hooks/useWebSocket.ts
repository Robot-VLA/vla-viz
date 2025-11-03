import { useEffect, useRef, useState, useCallback } from 'react';
import type { VisualizationData, ConnectionStatus } from '../types';
import { mockVisualizationData } from '../data/mockData';

const DEFAULT_WS_URL = 'ws://localhost:8765';

interface UseWebSocketOptions {
  url?: string;
  mockMode?: boolean;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const { url = DEFAULT_WS_URL, mockMode = false } = options;
  const [data, setData] = useState<VisualizationData | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<number | undefined>(undefined);

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setStatus('connecting');

    try {
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        console.log('WebSocket connected');
        setStatus('connected');
      };

      ws.current.onmessage = (event) => {
        try {
          const vizData = JSON.parse(event.data) as VisualizationData;
          setData(vizData);
        } catch (error) {
          console.error('Failed to parse message:', error);
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setStatus('error');
      };

      ws.current.onclose = () => {
        console.log('WebSocket disconnected');
        setStatus('disconnected');

        // Auto-reconnect after 2 seconds
        reconnectTimer.current = setTimeout(() => {
          console.log('Attempting to reconnect...');
          connect();
        }, 2000);
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      setStatus('error');
    }
  }, [url]);

  useEffect(() => {
    // If in mock mode, simulate connection and load mock data
    if (mockMode) {
      setStatus('connecting');
      // Simulate connection delay
      const timer = setTimeout(() => {
        setStatus('connected');
        setData(mockVisualizationData);
      }, 500);

      return () => clearTimeout(timer);
    }

    // Otherwise, use real WebSocket connection
    connect();

    return () => {
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
      }
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connect, mockMode]);

  return { data, status };
}
