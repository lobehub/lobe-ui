export const AUTO_HEIGHT_MESSAGE_TYPE = 'lobe-html-resize';

export const buildAutoHeightScript = (frameId: string) => `
(function () {
  var frameId = ${JSON.stringify(frameId)};
  function post() {
    try {
      var h = Math.max(
        document.documentElement.scrollHeight,
        document.body ? document.body.scrollHeight : 0,
      );
      parent.postMessage({ type: ${JSON.stringify(AUTO_HEIGHT_MESSAGE_TYPE)}, frameId: frameId, height: h }, '*');
    } catch (_) {}
  }

  function attach() {
    post();
    try {
      var ro = new ResizeObserver(post);
      if (document.body) ro.observe(document.body);
      if (document.documentElement) ro.observe(document.documentElement);
    } catch (_) {}
    window.addEventListener('load', post);
    window.addEventListener('resize', post);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attach);
  } else {
    attach();
  }
})();
`;
