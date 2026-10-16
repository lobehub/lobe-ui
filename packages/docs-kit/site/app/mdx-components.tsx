import * as stylex from '@stylexjs/stylex';
import { Link } from 'lucide-react';
import type { MDXComponents } from 'mdx/types';
import type { ComponentProps, MouseEvent } from 'react';

import { Api } from '../components/Api/Api';
import { Demo } from '../components/Demo/Demo';
import { headingMarker } from '../components/DocsLayout/markers.stylex';
import { styles as docsLayoutStyles } from '../components/DocsLayout/style';
import { CodeBlock } from '../components/Mdx/CodeBlock';
import { HEADING_SCROLL_OFFSET, springScrollToElement } from '../lib/scroller';

const createAnchoredHeading = (Tag: 'h2' | 'h3' | 'h4' | 'h5' | 'h6') =>
  function AnchoredHeading({ children, className, id, ...rest }: ComponentProps<'h2'>) {
    if (!id)
      return (
        <Tag className={className} {...rest}>
          {children}
        </Tag>
      );

    const handleAnchorClick = (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      const heading = document.getElementById(id);
      if (heading) {
        springScrollToElement(heading, HEADING_SCROLL_OFFSET);
      }
    };

    return (
      <Tag
        className={[className, stylex.props(headingMarker).className].filter(Boolean).join(' ')}
        id={id}
        {...rest}
      >
        {children}
        <a
          aria-label="Link to this section"
          {...stylex.props(docsLayoutStyles.headingAnchor)}
          href={`#${id}`}
          onClick={handleAnchorClick}
        >
          <Link aria-hidden size={14} strokeWidth={1.8} />
        </a>
      </Tag>
    );
  };

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Api,
    Demo,
    h1: createAnchoredHeading('h2'),
    h2: createAnchoredHeading('h2'),
    h3: createAnchoredHeading('h3'),
    h4: createAnchoredHeading('h4'),
    pre: CodeBlock,
    ...components,
  };
}
