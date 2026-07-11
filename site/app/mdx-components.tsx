import type { MDXComponents } from 'mdx/types';
import type { ComponentProps } from 'react';

import Demo from '../components/Demo/Demo';

const DocumentHeading = (props: ComponentProps<'h1'>) => <h2 {...props} />;

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Demo,
    h1: DocumentHeading,
    ...components,
  };
}
