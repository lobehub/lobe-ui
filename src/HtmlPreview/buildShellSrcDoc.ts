import { buildAutoHeightScript } from './injectAutoHeightScript';
import { STORAGE_SHIM_SCRIPT } from './injectStorageShim';

export const SHELL_UPDATE_MESSAGE_TYPE = 'lobe-html-shell-update';

interface BuildShellSrcDocOptions {
  background?: string;
  frameId: string;
}

/**
 * Build the iframe's one-and-only document.
 *
 * Why a "shell" doc:
 * The iframe is loaded *once* and never reloads during a streaming session.
 * All subsequent body updates arrive via `postMessage` from the parent
 * (see `SHELL_UPDATE_MESSAGE_TYPE`). The script in this document morphs the
 * live DOM in place, so already-painted nodes stay untouched — only nodes
 * that are *new* to this commit get a `.lobe-html-new` class and a CSS
 * fade-in. No iframe reload means no white flash, no script reboots, and
 * no jitter from height resets.
 */
export const buildShellSrcDoc = ({ background, frameId }: BuildShellSrcDocOptions): string => {
  const baseRules = `html,body{margin:0;padding:0;${background ? `background:${background};` : ''}color-scheme:light dark;}`;
  const fadeRules = `@keyframes lobe-html-fade{from{opacity:0}to{opacity:1}}.lobe-html-new{animation:lobe-html-fade 240ms ease-out both;}`;

  const morphScript = `
(function () {
  var FRAME_ID = ${JSON.stringify(frameId)};
  var UPDATE_TYPE = ${JSON.stringify(SHELL_UPDATE_MESSAGE_TYPE)};

  function cloneScript(src) {
    // <script> elements created via innerHTML are inert. Rebuild them as
    // proper DOM scripts so the browser executes them.
    var s = document.createElement('script');
    for (var i = 0; i < src.attributes.length; i++) {
      var a = src.attributes[i];
      s.setAttribute(a.name, a.value);
    }
    s.text = src.textContent || '';
    return s;
  }

  function importNode(node) {
    if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'SCRIPT') {
      return cloneScript(node);
    }
    return document.importNode(node, true);
  }

  function markFadeIn(node) {
    if (node.nodeType === Node.ELEMENT_NODE && node.classList) {
      node.classList.add('lobe-html-new');
    }
  }

  // Recursive prefix-match morph. For each parent we match leading children
  // that already exist (by outerHTML or recursive morph), then we remove
  // trailing children that no longer exist, and finally append the new
  // tail with a fade-in class.
  function morph(oldEl, newEl) {
    if (oldEl.nodeType !== newEl.nodeType) return false;
    if (oldEl.nodeType !== Node.ELEMENT_NODE) return false;
    if (oldEl.tagName !== newEl.tagName) return false;

    // Sync attributes
    var oldAttrs = oldEl.attributes;
    for (var i = oldAttrs.length - 1; i >= 0; i--) {
      var an = oldAttrs[i].name;
      if (!newEl.hasAttribute(an)) oldEl.removeAttribute(an);
    }
    var newAttrs = newEl.attributes;
    for (var j = 0; j < newAttrs.length; j++) {
      var na = newAttrs[j];
      if (oldEl.getAttribute(na.name) !== na.value) {
        oldEl.setAttribute(na.name, na.value);
      }
    }

    var oldKids = oldEl.childNodes;
    var newKids = newEl.childNodes;
    var commonLen = 0;

    while (commonLen < oldKids.length && commonLen < newKids.length) {
      var o = oldKids[commonLen];
      var n = newKids[commonLen];
      if (o.nodeType !== n.nodeType) break;
      if (o.nodeType === Node.TEXT_NODE) {
        if (o.textContent !== n.textContent) {
          // Update text content in place — no fade for text.
          o.textContent = n.textContent;
        }
        commonLen++;
      } else if (o.nodeType === Node.ELEMENT_NODE) {
        // Cheap identity check before recursing.
        if (o.outerHTML === n.outerHTML) {
          commonLen++;
        } else if (morph(o, n)) {
          commonLen++;
        } else {
          break;
        }
      } else {
        commonLen++;
      }
    }

    // Trim old trailing children that no longer exist.
    while (oldEl.childNodes.length > commonLen) {
      oldEl.removeChild(oldEl.lastChild);
    }

    // Append the new tail with fade-in markers.
    for (var k = commonLen; k < newKids.length; k++) {
      var imported = importNode(newKids[k]);
      markFadeIn(imported);
      oldEl.appendChild(imported);
    }

    return true;
  }

  function applyUpdate(payload) {
    if (!payload) return;
    var styleEl = document.getElementById('lobe-user-style');
    if (styleEl && styleEl.textContent !== payload.styleContent) {
      styleEl.textContent = payload.styleContent || '';
    }

    var parser = new DOMParser();
    var newDoc = parser.parseFromString(
      '<!doctype html><html><body>' + (payload.bodyHtml || '') + '</body></html>',
      'text/html',
    );

    // morph() returns false only for type mismatch on the root — body to
    // body always matches, so this is safe.
    morph(document.body, newDoc.body);
  }

  window.addEventListener('message', function (event) {
    var data = event.data;
    if (!data || data.type !== UPDATE_TYPE || data.frameId !== FRAME_ID) return;
    applyUpdate(data.payload);
  });

  // Signal the parent that the listener is wired up so it can flush any
  // pending content that was queued before this script ran.
  try {
    parent.postMessage({ type: UPDATE_TYPE + ':ready', frameId: FRAME_ID }, '*');
  } catch (_) {}
})();
`;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>${baseRules}${fadeRules}</style>
<style id="lobe-user-style"></style>
<script>${STORAGE_SHIM_SCRIPT}</script>
<script>${buildAutoHeightScript(frameId)}</script>
<script>${morphScript}</script>
</head>
<body></body>
</html>`;
};
