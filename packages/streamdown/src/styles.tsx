export const STREAM_FADE_DURATION = 180;

export const STREAMDOWN_ANIMATED_CLASS = 'streamdown-animated';

const css = `
@keyframes streamdown-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
.${STREAMDOWN_ANIMATED_CLASS} .stream-char {
  opacity: 0;
  animation-name: streamdown-fade-in;
  animation-duration: ${STREAM_FADE_DURATION}ms;
  animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
  animation-fill-mode: forwards;
}
.${STREAMDOWN_ANIMATED_CLASS} .stream-char-revealed {
  opacity: 1;
  animation: none;
}
.${STREAMDOWN_ANIMATED_CLASS} .katex-display .katex-html span {
  mask: none !important;
  animation: none !important;
}
`;

// React 19 hoists and dedupes <style href precedence> into <head>, which
// keeps this SSR-safe without any manual DOM injection.
export const StreamdownStyles = () => (
  <style href="lobehub-streamdown" precedence="default">
    {css}
  </style>
);
