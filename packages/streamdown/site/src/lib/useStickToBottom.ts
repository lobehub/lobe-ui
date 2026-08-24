import { useCallback, useEffect, useRef } from 'react';

const THRESHOLD = 32;

export const useStickToBottom = () => {
  const ref = useRef<HTMLDivElement>(null);
  const stuck = useRef(true);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new ResizeObserver(() => {
      if (!stuck.current) return;
      node.scrollTop = node.scrollHeight;
    });

    observer.observe(node);
    for (const child of node.children) observer.observe(child);

    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        for (const added of record.addedNodes) {
          if (added instanceof Element) observer.observe(added);
        }
      }
      if (stuck.current) node.scrollTop = node.scrollHeight;
    });
    mutations.observe(node, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);

  const onScroll = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    stuck.current = node.scrollHeight - node.scrollTop - node.clientHeight <= THRESHOLD;
  }, []);

  return { onScroll, ref };
};
