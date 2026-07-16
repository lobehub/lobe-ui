import { Check, Copy } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { styles } from './style';

interface CopyControlProps {
  label: string;
  value: string;
}

export function CopyControl({ label, value }: CopyControlProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(
    () => () => {
      window.clearTimeout(timerRef.current);
    },
    [],
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      return;
    }
    setCopied(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), 1600);
  };

  const Icon = copied ? Check : Copy;

  return (
    <button
      aria-label={copied ? 'Copied' : label}
      className={styles.root}
      data-copied={copied || undefined}
      title={label}
      type="button"
      onClick={handleCopy}
    >
      <Icon aria-hidden size={14} strokeWidth={1.8} />
    </button>
  );
}
