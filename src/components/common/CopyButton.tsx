import React from 'react';
import { Copy, Check } from 'lucide-react';

export interface CopyButtonProps {
  text: string;
  isCopied?: boolean;
  onCopy?: () => void;
  label?: string;
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  isCopied = false,
  onCopy,
  label = 'Copiar',
  className = '',
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCopy) {
      onCopy();
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <button
      onClick={handleClick}
      title={isCopied ? '¡Copiado!' : label}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-lg transition-all border ${
        isCopied
          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
      } ${className}`}
    >
      {isCopied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>Copiado</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
