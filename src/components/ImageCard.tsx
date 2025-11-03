import { cn } from '../lib/utils';

interface ImageCardProps {
  src: string;
  label: string;
  className?: string;
}

export function ImageCard({ src, label, className }: ImageCardProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="text-sm font-medium text-slate-300">{label}</div>
      <div className="relative rounded-lg overflow-hidden bg-slate-900 border border-slate-800">
        <img
          src={src}
          alt={label}
          className="w-full h-auto object-contain"
          loading="lazy"
        />
      </div>
    </div>
  );
}
