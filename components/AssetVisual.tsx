import { ArrowUpRight } from 'lucide-react';

interface AssetVisualProps {
  kind: string;
  label?: string;
  className?: string;
  src?: string;
}

export function AssetVisual({ kind, label = 'Client image pending', className = '', src }: AssetVisualProps) {
  return (
    <div className={`asset-visual asset-${kind} ${className} group`} role="img" aria-label={label}>
      {src ? (
        <>
          <img 
            src={src} 
            alt={label} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-black/25 pointer-events-none transition-opacity duration-300 group-hover:bg-black/35" />
        </>
      ) : (
        <div className="asset-grain" />
      )}
      <span className="asset-caption z-10">{label}</span>
      <ArrowUpRight size={17} strokeWidth={1.4} className="asset-arrow z-10 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </div>
  );
}
