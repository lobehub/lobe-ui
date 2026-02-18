interface StreamAnimationDebugWindow extends Window {
  __LOBE_MARKDOWN_STREAM_DEBUG__?: boolean;
}

const getDebugWindow = (): StreamAnimationDebugWindow | null => {
  if (typeof window === 'undefined') return null;
  return window as StreamAnimationDebugWindow;
};

export const isStreamAnimationDebugEnabled = () => {
  return getDebugWindow()?.__LOBE_MARKDOWN_STREAM_DEBUG__ === true;
};

export const streamAnimationDebugLog = (scope: string, payload: Record<string, unknown>) => {
  if (!isStreamAnimationDebugEnabled()) return;

  const timestamp = new Date().toISOString().slice(11, 23);
  console.log(`[StreamAnimDebug ${timestamp}] ${scope}`, JSON.stringify(payload));
};
