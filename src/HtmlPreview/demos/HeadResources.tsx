import { HtmlPreview } from '@lobehub/ui';

// Full-document HTML whose styling depends on a <script src> in <head>
// (Tailwind Play CDN). Demonstrates that head-loaded resources are
// preserved by the shell-doc + postMessage pipeline.
const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 font-sans p-6">
  <div class="max-w-md mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 p-1 shadow-xl">
    <div class="rounded-[14px] bg-slate-900 p-5">
      <span class="inline-block text-[11px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full bg-cyan-300 text-slate-900">
        Tailwind CDN
      </span>
      <h2 class="mt-3 text-lg font-semibold">Head resources work</h2>
      <p class="mt-1 text-sm text-slate-300">
        This card is styled by Tailwind, loaded from
        <code class="text-cyan-300">cdn.tailwindcss.com</code>
        via a &lt;script&gt; tag in &lt;head&gt;.
      </p>
      <button
        class="mt-4 px-4 py-2 rounded-lg bg-cyan-400 text-slate-900 text-sm font-medium hover:bg-cyan-300 transition"
        onclick="alert('Inline handler still works under the sandbox.')"
      >
        Try a handler
      </button>
    </div>
  </div>
</body>
</html>
`;

export default () => (
  <HtmlPreview defaultHeight={320} theme={'dark'}>
    {html}
  </HtmlPreview>
);
