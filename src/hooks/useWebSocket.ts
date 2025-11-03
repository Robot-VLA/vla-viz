import { useEffect, useRef, useState, useCallback } from 'react';
import type { VisualizationData, ConnectionStatus } from '../types';
import { mockVisualizationData, generateMockData } from '../data/mockData';

const DEFAULT_WS_URL = 'ws://localhost:8765';
const DEFAULT_HISTORY_SIZE = 100; // Store last 100 frames

interface UseWebSocketOptions {
  url?: string;
  mockMode?: boolean;
  maxHistorySize?: number;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const { url = DEFAULT_WS_URL, mockMode = false, maxHistorySize = DEFAULT_HISTORY_SIZE } = options;
  const [data, setData] = useState<VisualizationData | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const [history, setHistory] = useState<VisualizationData[]>([]);
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<number | undefined>(undefined);
  const historyWarningShown = useRef<boolean>(false);

  // Function to add data to history with buffer management
  const addToHistory = useCallback((newData: VisualizationData) => {
    setHistory((prev) => {
      // If we've reached the limit, show warning and clear
      if (prev.length >= maxHistorySize) {
        if (!historyWarningShown.current) {
          console.warn(`History buffer limit reached (${maxHistorySize} frames). Clearing buffer...`);
          historyWarningShown.current = true;
          // Reset warning flag after a delay
          setTimeout(() => {
            historyWarningShown.current = false;
          }, 5000);
        }
        // Clear buffer and start fresh
        return [newData];
      }
      // Add new data to the end
      return [...prev, newData];
    });
    setData(newData);
  }, [maxHistorySize]);

  // Function to clear history
  const clearHistory = useCallback(() => {
    setHistory([]);
    historyWarningShown.current = false;
  }, []);

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
          addToHistory(vizData);
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
  }, [url, addToHistory]);

  useEffect(() => {
    // If in mock mode, simulate connection and streaming data
    if (mockMode) {
      setStatus('connecting');
      let frameIndex = 0;

      // Simulate connection delay
      const connectionTimer = setTimeout(() => {
        setStatus('connected');
        addToHistory(mockVisualizationData);

        // Start streaming mock data every 500ms
        const streamInterval = setInterval(() => {
          frameIndex++;
          addToHistory(generateMockData(frameIndex));
        }, 500);

        // Store interval ref for cleanup
        reconnectTimer.current = streamInterval as unknown as number;
      }, 500);

      return () => {
        clearTimeout(connectionTimer);
        if (reconnectTimer.current) {
          clearInterval(reconnectTimer.current);
        }
      };
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
  }, [connect, mockMode, addToHistory]);

  return { data, status, history, clearHistory };
}
