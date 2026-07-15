import { extractStaticStyle } from 'antd-style';
import { prerender } from 'react-dom/static';
import { type EntryContext, ServerRouter } from 'react-router';

import { buildInlineAntdStyle } from './app/antdStaticCss.server';

const STREAM_TIMEOUT = 5000;

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
) {
  if (request.method.toUpperCase() === 'HEAD') {
    return new Response(null, {
      headers: responseHeaders,
      status: responseStatusCode,
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), STREAM_TIMEOUT);
  let status = responseStatusCode;

  try {
    const { postponed, prelude } = await prerender(
      <ServerRouter context={routerContext} url={request.url} />,
      {
        onError(error) {
          status = 500;
          console.error(error);
        },
        signal: controller.signal,
      },
    );

    if (postponed !== null) {
      throw new Error(
        `Incomplete static prerender for ${new URL(request.url).pathname}: React postponed unresolved content`,
      );
    }

    const html = await new Response(prelude).text();
    // antd rules ship via /antd.css, so the inline antd entry shrinks to component
    // css-var blocks (+ fallback rules for components the probe missed); emotion
    // styles (createStaticStyles / injectGlobal / createStyles) stay per-page.
    const styles =
      buildInlineAntdStyle(extractStaticStyle.cache) +
      extractStaticStyle(html, { includeAntd: false })
        .map(({ tag }) => tag)
        .join('');
    // replacer fn: extracted CSS can contain `$'` (e.g. content:'$ ') which
    // String.replace would expand as a substitution pattern
    const document = styles ? html.replace('</head>', () => `${styles}</head>`) : html;

    responseHeaders.set('Content-Type', 'text/html');

    return new Response(document, {
      headers: responseHeaders,
      status,
    });
  } finally {
    clearTimeout(timeout);
  }
}
