import { EditorSlashMenu, type EditorSlashMenuOption } from '@lobehub/ui';
import { createStaticStyles } from 'antd-style';
import { Code2, Heading1, Image, List, Quote, Table } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';

type VirtualElementLike = {
  getBoundingClientRect: () => DOMRect;
};

const styles = createStaticStyles(({ css, cssVar }) => ({
  container: css`
    width: min(760px, 100%);
    padding: 24px;
    border: 1px solid ${cssVar.colorBorderSecondary};
    border-radius: 16px;

    background: ${cssVar.colorBgContainer};
  `,
  hint: css`
    margin-block: 0 16px;
    margin-inline: 0;

    font-size: 13px;
    line-height: 18px;
    color: ${cssVar.colorTextTertiary};
  `,
  textarea: css`
    width: 100%;
    min-height: 180px;
    padding: 12px;
    border: 1px solid ${cssVar.colorBorderSecondary};
    border-radius: 12px;

    font-size: 14px;
    line-height: 20px;
    color: ${cssVar.colorText};

    background: ${cssVar.colorBgElevated};
    outline: none;

    &:focus {
      border-color: ${cssVar.colorPrimary};
      box-shadow: 0 0 0 2px ${cssVar.colorPrimaryBg};
    }
  `,
  title: css`
    margin-block: 0 12px;
    margin-inline: 0;

    font-size: 14px;
    font-weight: 600;
    color: ${cssVar.colorText};
  `,
}));

const isSlashTrigger = (textBeforeCaret: string, slashIndex: number) => {
  if (slashIndex < 0) return false;
  const prev = slashIndex === 0 ? ' ' : textBeforeCaret[slashIndex - 1]!;
  // Only trigger when slash begins a token.
  return /\s/.test(prev);
};

const computeQueryFromCaret = (value: string, caret: number) => {
  const before = value.slice(0, caret);
  const slashIndex = before.lastIndexOf('/');
  if (!isSlashTrigger(before, slashIndex)) return null;

  const query = before.slice(slashIndex + 1);
  // Stop if query contains whitespace/newline.
  if (/\s/.test(query)) return null;
  return { query, slashIndex };
};

const getTextareaCaretRect = (textarea: HTMLTextAreaElement, caret: number): DOMRect => {
  const value = textarea.value;
  const computed = window.getComputedStyle(textarea);

  const div = document.createElement('div');
  const span = document.createElement('span');

  div.style.position = 'absolute';
  div.style.visibility = 'hidden';
  div.style.whiteSpace = 'pre-wrap';
  div.style.wordBreak = 'break-word';
  div.style.overflow = 'auto';

  // Mirror layout-critical styles
  div.style.boxSizing = computed.boxSizing;
  div.style.width = computed.width;
  div.style.padding = computed.padding;
  div.style.border = computed.border;
  div.style.font = computed.font;
  div.style.letterSpacing = computed.letterSpacing;
  div.style.textTransform = computed.textTransform;
  div.style.lineHeight = computed.lineHeight;
  div.style.tabSize = (computed as any).tabSize ?? '8';

  // Mirror scroll position
  div.scrollTop = textarea.scrollTop;
  div.scrollLeft = textarea.scrollLeft;

  // Content before caret
  div.textContent = value.slice(0, caret);

  // Marker
  span.textContent = value.slice(caret) || '.';
  div.append(span);

  document.body.append(div);
  const textareaRect = textarea.getBoundingClientRect();
  const spanRect = span.getBoundingClientRect();
  const divRect = div.getBoundingClientRect();

  // Translate span rect into textarea coordinate system.
  const left = textareaRect.left + (spanRect.left - divRect.left);
  const top = textareaRect.top + (spanRect.top - divRect.top);

  div.remove();

  const height = Number.parseFloat(computed.lineHeight || '20') || 20;
  return new DOMRect(left, top, 0, height);
};

export default () => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [text, setText] = useState('Type `/` to open slash menu.\n\n/');
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const caretRectRef = useRef<DOMRect>(new DOMRect(0, 0, 0, 0));
  const slashIndexRef = useRef<number | null>(null);

  const anchor = useMemo(() => {
    const ve: VirtualElementLike = {
      getBoundingClientRect: () => caretRectRef.current,
    };
    return ve;
  }, []);

  const items = useMemo<EditorSlashMenuOption[]>(
    () => [
      {
        icon: <Heading1 size={16} />,
        keywords: ['h1', 'title'],
        label: 'Heading 1',
        value: 'heading-1',
      },
      { icon: <List size={16} />, keywords: ['bullet', 'ul'], label: 'List', value: 'list' },
      { icon: <Quote size={16} />, keywords: ['blockquote'], label: 'Quote', value: 'quote' },
      { icon: <Code2 size={16} />, keywords: ['snippet'], label: 'Code Block', value: 'code' },
      { icon: <Image size={16} />, keywords: ['img', 'media'], label: 'Image', value: 'image' },
      { icon: <Table size={16} />, keywords: ['grid'], label: 'Table', value: 'table' },
    ],
    [],
  );

  const syncFromTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;

    const caret = el.selectionStart ?? 0;
    const resolved = computeQueryFromCaret(el.value, caret);

    // Update caret rect for anchoring (even when closed, to reduce flicker).
    caretRectRef.current = getTextareaCaretRect(el, caret);

    if (!resolved) {
      slashIndexRef.current = null;
      setOpen(false);
      setQuery('');
      return;
    }

    slashIndexRef.current = resolved.slashIndex;
    setOpen(true);
    setQuery(resolved.query);
  };

  const applySelection = (item: EditorSlashMenuOption) => {
    const el = textareaRef.current;
    if (!el) return;

    const caret = el.selectionStart ?? 0;
    const slashIndex = slashIndexRef.current;

    if (slashIndex == null) return;

    const before = el.value.slice(0, slashIndex);
    const after = el.value.slice(caret);
    const insert = `/${item.value} `;
    const next = `${before}${insert}${after}`;

    const nextCaret = before.length + insert.length;
    setText(next);
    setOpen(false);
    setQuery('');
    slashIndexRef.current = null;

    requestAnimationFrame(() => {
      const nextEl = textareaRef.current;
      if (!nextEl) return;
      nextEl.focus();
      nextEl.setSelectionRange(nextCaret, nextCaret);
      caretRectRef.current = getTextareaCaretRect(nextEl, nextCaret);
    });
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>EditorSlashMenu</h3>
      <p className={styles.hint}>
        Type <code>/</code> then continue typing to filter. Click an item to insert.
      </p>

      <textarea
        className={styles.textarea}
        ref={textareaRef}
        value={text}
        onClick={() => requestAnimationFrame(syncFromTextarea)}
        onKeyUp={() => requestAnimationFrame(syncFromTextarea)}
        onChange={(e) => {
          setText(e.target.value);
          // caret rect depends on DOM value, so defer until state flush.
          requestAnimationFrame(syncFromTextarea);
        }}
      />

      <EditorSlashMenu
        anchor={anchor}
        items={items}
        open={open}
        value={query}
        onSelect={(item) => applySelection(item)}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) {
            setQuery('');
            slashIndexRef.current = null;
          }
        }}
      />
    </div>
  );
};
