import { Radio, Pause, Play } from 'lucide-react';

interface TimelineProps {
  isLive: boolean;
  currentIndex: number;
  totalFrames: number;
  onIndexChange: (index: number) => void;
  onToggleLive: () => void;
  historySize: number;
  maxHistorySize: number;
}

export function Timeline({
  isLive,
  currentIndex,
  totalFrames,
  onIndexChange,
  onToggleLive,
  historySize,
  maxHistorySize,
}: TimelineProps) {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIndex = parseInt(e.target.value, 10);
    onIndexChange(newIndex);
  };

  const progress = (historySize / maxHistorySize) * 100;

  // When live, show slider at the current buffer position
  // When paused, show at the selected position
  const displayIndex = isLive ? Math.max(0, historySize - 1) : currentIndex;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-sm border-t border-slate-800/50 shadow-lg z-20">
      <div className="max-w-[1800px] mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Live/Pause Button */}
          <button
            onClick={onToggleLive}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              isLive
                ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
            }`}
          >
            {isLive ? (
              <>
                <Radio className="w-4 h-4 animate-pulse" />
                LIVE
              </>
            ) : (
              <>
                <Pause className="w-4 h-4" />
                Paused
              </>
            )}
          </button>

          {/* Timeline Slider */}
          <div className="flex-1 flex items-center gap-3">
            <span className="text-xs text-slate-500 font-mono min-w-[80px]">
              {displayIndex + 1} / {totalFrames}
            </span>
            <div className="flex-1 relative">
              {/* Progress bar showing buffer fill */}
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-slate-800 rounded-full">
                <div
                  className="h-full bg-blue-500/30 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {/* Slider */}
              <input
                type="range"
                min="0"
                max={Math.max(0, maxHistorySize - 1)}
                value={displayIndex}
                onChange={handleSliderChange}
                disabled={totalFrames === 0}
                className="timeline-slider w-full h-2 bg-transparent appearance-none cursor-pointer relative z-10"
                style={{
                  background: 'transparent',
                }}
              />
            </div>
            <span className="text-xs text-slate-500 min-w-[100px] text-right">
              Buffer: {historySize}/{maxHistorySize}
            </span>
          </div>

          {/* Play button when paused */}
          {!isLive && totalFrames > 0 && (
            <button
              onClick={onToggleLive}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-all"
              title="Return to live mode"
            >
              <Play className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
