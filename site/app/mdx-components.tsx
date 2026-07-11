import type { MDXComponents } from 'mdx/types';
import type { ComponentProps } from 'react';

const DocumentHeading = (props: ComponentProps<'h1'>) => <h2 {...props} />;

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: DocumentHeading,
    ...components,
  };
}
