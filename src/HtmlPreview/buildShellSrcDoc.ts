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
    // <script> elements parsed via DOMParser are inert. Rebuild them as
    // proper DOM scripts so the browser executes them.
    //
    // Important: only set .text for inline scripts. Setting it on a
    // src-bearing script (even to an empty string) causes some browser /
    // extension combinations to treat the element as an inline script
    // with empty body and skip the external fetch — so the CDN never
    // loads. We just copy attributes; the browser will fetch the src on
    // append.
    var s = document.createElement('script');
    for (var i = 0; i < src.attributes.length; i++) {
      var a = src.attributes[i];
      s.setAttribute(a.name, a.value);
    }
    if (!src.hasAttribute('src')) {
      var text = src.textContent;
      if (text) s.text = text;
    }
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

    // Append the new tail with fade-in markers, batched through a
    // DocumentFragment. A flat sequence of appendChild calls fires one
    // mutation per element — MutationObserver libraries (Tailwind Play
    // CDN, Stimulus, etc.) that batch their work can drop intermediate
    // notifications if they arrive too quickly. Going through a fragment
    // delivers exactly one childList mutation that lists all new nodes
    // at once, which observers handle reliably.
    if (commonLen < newKids.length) {
      var frag = document.createDocumentFragment();
      for (var k = commonLen; k < newKids.length; k++) {
        var imported = importNode(newKids[k]);
        markFadeIn(imported);
        frag.appendChild(imported);
      }
      oldEl.appendChild(frag);
    }

    return true;
  }

  // Track which head extras (scripts/links/meta/title/base) we've already
  // mounted so re-arriving chunks don't re-execute scripts or duplicate
  // resources. Keyed by outerHTML — for streaming partial URLs each
  // partial-and-then-complete tag is a distinct key, which means a partial
  // CDN URL may briefly 404 before the complete one succeeds. That's
  // acceptable; the alternative (waiting for the closing tag heuristic) is
  // fragile and would defeat the live-CDN use case entirely.
  var headSeen = Object.create(null);

  function syncHeadExtras(headExtrasHtml) {
    if (typeof headExtrasHtml !== 'string') return;
    var parser = new DOMParser();
    var doc = parser.parseFromString(
      '<!doctype html><html><head>' + headExtrasHtml + '</head></html>',
      'text/html',
    );
    var children = doc.head ? doc.head.children : [];
    for (var i = 0; i < children.length; i++) {
      var src = children[i];
      var key = src.outerHTML;
      if (headSeen[key]) continue;
      headSeen[key] = true;
      var clone = importNode(src);
      // Tag for debugging — also keeps these distinguishable from the
      // shell's own head children if anything ever needs to inspect them.
      if (clone.setAttribute) clone.setAttribute('data-lobe-user', '');
      document.head.appendChild(clone);
    }
  }

  function applyUpdate(payload) {
    if (!payload) return;

    // 1) Inline user styles: merged into a single growing <style> element.
    //    Streaming partial CSS just keeps overwriting this text until the
    //    rules become complete, so we don't stack half-parsed <style>
    //    blocks in the head.
    var styleEl = document.getElementById('lobe-user-style');
    if (styleEl && styleEl.textContent !== payload.styleContent) {
      styleEl.textContent = payload.styleContent || '';
    }

    // 2) Everything else in the user's <head> (scripts, links, meta, …):
    //    append-with-dedupe so head-loaded resources actually run.
    syncHeadExtras(payload.headExtrasHtml);

    // 3) Body: in-place morph with fade-in on new nodes.
    var bodyParser = new DOMParser();
    var newDoc = bodyParser.parseFromString(
      '<!doctype html><html><body>' + (payload.bodyHtml || '') + '</body></html>',
      'text/html',
    );

    // morph() returns false only for type mismatch on the root — body to
    // body always matches, so this is safe.
    morph(document.body, newDoc.body);

    // Nudge class-engine CDNs (Tailwind Play CDN, Stimulus, etc.) into
    // re-scanning the document. They watch via MutationObserver but some
    // implementations only consider the directly-mutated nodes from each
    // record and skip recursing into nested descendants, so deeply-styled
    // subtrees can end up with un-generated utility classes. Toggling a
    // throwaway class on body produces an attribute mutation that prompts
    // a fresh full-document scan.
    try {
      document.body.classList.add('_lobe-rescan');
      document.body.classList.remove('_lobe-rescan');
    } catch (_) {}
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
