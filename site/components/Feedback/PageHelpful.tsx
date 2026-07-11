import './PageHelpful.css';

import { useRef, useState } from 'react';

interface PageHelpfulProps {
  pathname: string;
}

type HelpfulResponse = 'no' | 'yes';

interface HelpfulSelection {
  response: HelpfulResponse;
  routeGeneration: number;
}

export default function PageHelpful({ pathname }: PageHelpfulProps) {
  const routeRef = useRef({ generation: 0, pathname });
  if (routeRef.current.pathname !== pathname) {
    routeRef.current = { generation: routeRef.current.generation + 1, pathname };
  }
  const [selection, setSelection] = useState<HelpfulSelection>();
  const routeGeneration = routeRef.current.generation;
  const response = selection?.routeGeneration === routeGeneration ? selection.response : undefined;

  return (
    <section aria-label="Page feedback" className="page-helpful" data-pagefind-ignore="all">
      {response ? (
        <p role="status">
          Thanks for the feedback<span aria-hidden> · </span>
          <span>{response === 'yes' ? 'Glad this helped.' : 'We will keep improving it.'}</span>
        </p>
      ) : (
        <>
          <p>Was this page helpful?</p>
          <div aria-label="Was this page helpful?" role="group">
            <button
              type="button"
              onClick={() => setSelection({ response: 'yes', routeGeneration })}
            >
              Yes
            </button>
            <button type="button" onClick={() => setSelection({ response: 'no', routeGeneration })}>
              No
            </button>
          </div>
        </>
      )}
    </section>
  );
}
