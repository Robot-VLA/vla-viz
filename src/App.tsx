import { useState, useEffect } from "react";
import { useWebSocket } from "./hooks/useWebSocket";
import { ConnectionStatus } from "./components/ConnectionStatus";
import { Timeline } from "./components/Timeline";
import {
  AlertCircle,
  Activity,
  Eye,
  Image as ImageIcon,
  Layers,
} from "lucide-react";

const MAX_HISTORY_SIZE = 100;

function App() {
  // Check for mock mode via URL parameter (?mock=true) or localStorage
  const urlParams = new URLSearchParams(window.location.search);
  const mockMode =
    urlParams.get("mock") === "true" ||
    localStorage.getItem("mockMode") === "true";

  const { data, status, history } = useWebSocket({
    mockMode,
    maxHistorySize: MAX_HISTORY_SIZE,
  });

  // History navigation state
  const [isLive, setIsLive] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-update currentIndex when in live mode
  useEffect(() => {
    if (isLive && history.length > 0) {
      setCurrentIndex(history.length - 1);
    }
  }, [isLive, history.length]);

  // Determine what data to display
  const displayData = isLive ? data : history[currentIndex];

  // Handlers
  const handleIndexChange = (newIndex: number) => {
    setIsLive(false);
    setCurrentIndex(newIndex);
  };

  const handleToggleLive = () => {
    if (!isLive) {
      // Switching to live mode
      setIsLive(true);
      if (history.length > 0) {
        setCurrentIndex(history.length - 1);
      }
    } else {
      // Pausing live mode
      setIsLive(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Compact Header */}
      <div className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800/50 shadow-lg">
        <div className="max-w-[1800px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-blue-400" />
              <div>
                <h1 className="text-xl font-bold text-slate-100">
                  OpenPI Live Visualization
                  {mockMode && (
                    <span className="ml-2 text-xs font-normal text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded">
                      Mock Mode
                    </span>
                  )}
                </h1>
                <p className="text-xs text-slate-400">
                  Real-time model input monitoring
                </p>
              </div>
            </div>
            <ConnectionStatus status={status} />
          </div>
        </div>
      </div>

      {/* Main Content - Dashboard Layout */}
      <div className="max-w-[1800px] mx-auto p-4 pb-24">
        {/* Empty State */}
        {!displayData && (
          <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
            <div className="text-center space-y-4">
              <AlertCircle className="w-16 h-16 mx-auto text-slate-600" />
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-300">
                  {status === "connected"
                    ? "Waiting for data..."
                    : "Not connected"}
                </h3>
                <p className="text-slate-500 max-w-md">
                  {status === "connecting" &&
                    "Connecting to visualization server..."}
                  {status === "connected" &&
                    "Start training with visualization enabled to see model inputs."}
                  {status === "disconnected" &&
                    "Connection lost. Attempting to reconnect..."}
                  {status === "error" &&
                    "Failed to connect. Ensure the server is running on ws://localhost:8765"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Grid */}
        {displayData && (
          <div className="grid grid-cols-12 gap-4">
            {/* Left Column - Metadata + Query Image */}
            <div className="col-span-12 lg:col-span-3 space-y-4">
              {/* Metadata Card */}
              {displayData.metadata &&
                Object.keys(displayData.metadata).length > 0 && (
                  <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Layers className="w-4 h-4 text-blue-400" />
                      <h2 className="text-sm font-semibold text-slate-200">
                        Metadata
                      </h2>
                    </div>
                    <div className="space-y-2">
                      {Object.entries(displayData.metadata)
                        .filter(
                          // eslint-disable-next-line @typescript-eslint/no-unused-vars
                          ([_, value]) => value !== undefined && value !== null
                        )
                        .map(([key, value]) => (
                          <div key={key} className="text-xs">
                            <div className="text-slate-500 mb-0.5">{key}</div>
                            <div className="text-slate-300 break-words bg-slate-950/50 rounded px-2 py-1">
                              {typeof value === "object"
                                ? JSON.stringify(value)
                                : String(value)}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

              {/* Query Image Card */}
              {displayData.query_image && (
                <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Eye className="w-4 h-4 text-purple-400" />
                    <h2 className="text-sm font-semibold text-slate-200">
                      Query Image
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">
                    Used for ICL retrieval
                  </p>
                  <div className="relative rounded-lg overflow-hidden bg-slate-950 border border-slate-800">
                    <img
                      src={displayData.query_image}
                      alt="Query Image"
                      className="w-full h-auto object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Observations + ICL Examples */}
            <div className="col-span-12 lg:col-span-9 space-y-4">
              {/* Observation Images - Horizontal Layout */}
              {displayData.observation_images &&
                Object.keys(displayData.observation_images).length > 0 && (
                  <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <ImageIcon className="w-4 h-4 text-green-400" />
                      <h2 className="text-sm font-semibold text-slate-200">
                        Observation Images
                      </h2>
                      <span className="text-xs text-slate-500">
                        (Model Inputs)
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {Object.entries(displayData.observation_images).map(
                        ([key, src]) => (
                          <div key={key} className="space-y-1">
                            <div className="text-[10px] text-slate-500 text-center">
                              {key}
                            </div>
                            <div className="relative rounded overflow-hidden bg-slate-950 border border-slate-800 aspect-video">
                              <img
                                src={src}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* ICL Examples - Row Layout */}
              {displayData.icl_images && displayData.icl_images.length > 0 && (
                <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Layers className="w-4 h-4 text-orange-400" />
                    <h2 className="text-sm font-semibold text-slate-200">
                      ICL Examples
                    </h2>
                    <span className="text-xs text-slate-500">
                      ({displayData.icl_images.length})
                    </span>
                  </div>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {displayData.icl_images.map((example, index) => (
                      <div
                        key={index}
                        className="bg-slate-950/50 border border-slate-800 rounded-lg p-3"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-medium text-slate-400">
                            Example {index + 1}
                          </span>
                          {displayData.metadata.icl_prompts &&
                            (displayData.metadata.icl_prompts as string[])[
                              index
                            ] && (
                              <span className="text-xs text-slate-500 truncate max-w-[300px]">
                                {
                                  (
                                    displayData.metadata.icl_prompts as string[]
                                  )[index]
                                }
                              </span>
                            )}
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          {Object.entries(example).map(([key, src]) => (
                            <div key={key} className="space-y-1">
                              <div className="text-[10px] text-slate-500 text-center">
                                {key}
                              </div>
                              <div className="relative rounded overflow-hidden bg-slate-950 border border-slate-800 aspect-video">
                                <img
                                  src={src}
                                  alt={`${key}-${index}`}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Timeline Navigation */}
      <Timeline
        isLive={isLive}
        currentIndex={currentIndex}
        totalFrames={history.length}
        onIndexChange={handleIndexChange}
        onToggleLive={handleToggleLive}
        historySize={history.length}
        maxHistorySize={MAX_HISTORY_SIZE}
      />
    </div>
  );
}

export default App;
