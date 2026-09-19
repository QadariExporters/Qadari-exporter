import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  isActive: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
  onClick?: () => void;
  interactive?: boolean;
}

export function StatusBadge({
  isActive,
  activeLabel = 'Active',
  inactiveLabel = 'Inactive',
  onClick,
  interactive = false,
}: StatusBadgeProps) {
  return (
    <button
      type="button"
      onClick={interactive ? onClick : undefined}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
        interactive ? 'cursor-pointer hover:opacity-80 active:scale-95' : 'cursor-default'
      } ${
        isActive
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
      }`}
    >
      {isActive ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
      ) : (
        <XCircle className="w-3.5 h-3.5 text-zinc-400" />
      )}
      <span>{isActive ? activeLabel : inactiveLabel}</span>
    </button>
  );
}
