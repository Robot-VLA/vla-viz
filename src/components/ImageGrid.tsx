import { ImageCard } from './ImageCard';

interface ImageGridProps {
  title: string;
  images: Record<string, string>;
  columns?: number;
}

export function ImageGrid({ title, images, columns = 3 }: ImageGridProps) {
  const entries = Object.entries(images);

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-100">{title}</h2>
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${Math.min(columns, entries.length)}, minmax(0, 1fr))`,
        }}
      >
        {entries.map(([key, src]) => (
          <ImageCard key={key} src={src} label={key} />
        ))}
      </div>
    </div>
  );
}
