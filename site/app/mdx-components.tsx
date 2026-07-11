import type { MDXComponents } from 'mdx/types';
import type { ComponentProps } from 'react';

import Api from '../components/Api/Api';
import Demo from '../components/Demo/Demo';

const DocumentHeading = (props: ComponentProps<'h1'>) => <h2 {...props} />;

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Api,
    Demo,
    h1: DocumentHeading,
    ...components,
  };
}
