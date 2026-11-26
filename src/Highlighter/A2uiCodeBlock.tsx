'use client';

import clsx from 'clsx';
import { Check, Copy } from 'lucide-react';
import { type CSSProperties, type ReactNode, useCallback } from 'react';

import { useCopied } from '@/hooks/useCopied';
import highlighterMessages from '@/i18n/resources/en/highlighter';
import { useTranslation } from '@/i18n/useTranslation';
import { a2uiStyles } from '@/internal/a2ui/styles';
import { styleProps } from '@/styles/stylex/props';
import { copyToClipboard } from '@/utils/copyToClipboard';

import { a2uiCodeStyles } from './a2uiStyle';
import { highlighterClasses } from './stable';

interface A2uiCodeBlockProps {
  actions: ReactNode;
  body: ReactNode;
  className?: string;
  classNames?: { body?: string; header?: string };
  label?: string;
  style?: CSSProperties;
  styles?: { body?: CSSProperties; header?: CSSProperties };
}

export const A2uiCopyButton = ({ getContent }: { getContent: () => string }) => {
  const { t } = useTranslation(highlighterMessages);
  const { copied, setCopied } = useCopied();
  const handleCopy = useCallback(async () => {
    await copyToClipboard(getContent());
    setCopied();
  }, [getContent, setCopied]);

  return (
    <button {...styleProps(a2uiCodeStyles.copy)} type="button" onClick={handleCopy}>
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? t('highlighter.copied') : t('highlighter.copy')}
    </button>
  );
};

/** The A2UI playground code block frame: mac dots, file label, copy button, code. */
const A2uiCodeBlock = ({
  actions,
  body,
  className,
  classNames,
  label,
  style,
  styles,
}: A2uiCodeBlockProps) => (
  // Adapted from CopilotKit a2ui-playground (MIT): `renderers/content.tsx` CodeBlock.
  <figure
    data-code-type="highlighter"
    data-variant="a2ui"
    {...styleProps(
      [a2uiStyles.base, a2uiStyles.card, a2uiCodeStyles.root],
      clsx('lobe-highlighter', 'lobe-highlighter-a2ui', className),
      style,
    )}
  >
    <figcaption
      {...styleProps(
        a2uiCodeStyles.header,
        clsx(highlighterClasses('header'), classNames?.header),
        styles?.header,
      )}
    >
      <span {...styleProps(a2uiCodeStyles.label, highlighterClasses('title'))}>
        <span {...styleProps(a2uiCodeStyles.dots)}>
          <span {...styleProps(a2uiCodeStyles.dot)} />
          <span {...styleProps(a2uiCodeStyles.dot)} />
          <span {...styleProps(a2uiCodeStyles.dot)} />
        </span>
        {label}
      </span>
      {actions}
    </figcaption>
    <div
      {...styleProps(
        a2uiCodeStyles.body,
        clsx(highlighterClasses('body'), classNames?.body),
        styles?.body,
      )}
    >
      {body}
    </div>
  </figure>
);

export default A2uiCodeBlock;
