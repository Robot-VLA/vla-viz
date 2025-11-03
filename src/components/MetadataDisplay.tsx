interface MetadataDisplayProps {
  metadata: Record<string, unknown>;
}

export function MetadataDisplay({ metadata }: MetadataDisplayProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const entries = Object.entries(metadata).filter(([_, value]) => value !== undefined && value !== null);

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold text-slate-100">Metadata</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {entries.map(([key, value]) => (
          <div key={key} className="px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-800">
            <div className="text-xs font-medium text-slate-400 mb-1">{key}</div>
            <div className="text-sm text-slate-200 break-words">
              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
