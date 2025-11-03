import { ImageCard } from './ImageCard';

interface ICLExamplesProps {
  examples: Array<Record<string, string>>;
  prompts?: string[];
}

export function ICLExamples({ examples, prompts }: ICLExamplesProps) {
  if (examples.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-100">In-Context Learning Examples</h2>
      <div className="space-y-8">
        {examples.map((example, index) => (
          <div key={index} className="p-4 rounded-lg bg-slate-900/30 border border-slate-800">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-medium text-slate-400">Example {index + 1}</span>
              {prompts && prompts[index] && (
                <span className="text-sm text-slate-500">• {prompts[index]}</span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(example).map(([key, src]) => (
                <ImageCard key={key} src={src} label={key} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
