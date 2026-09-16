import { useState, useCallback } from 'react';

export function useClipboard(timeoutMs: number = 2500) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = useCallback(
    (text: string, id: string = 'default') => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          setCopiedId(id);
          setTimeout(() => setCopiedId(null), timeoutMs);
        });
      }
    },
    [timeoutMs]
  );

  const isCopied = useCallback((id: string = 'default') => copiedId === id, [copiedId]);

  return { copiedId, copy, isCopied };
}
