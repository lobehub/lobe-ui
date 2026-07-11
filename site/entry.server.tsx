import { prerender } from 'react-dom/static';
import { type EntryContext, ServerRouter } from 'react-router';

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

    responseHeaders.set('Content-Type', 'text/html');

    return new Response(prelude, {
      headers: responseHeaders,
      status,
    });
  } finally {
    clearTimeout(timeout);
  }
}
