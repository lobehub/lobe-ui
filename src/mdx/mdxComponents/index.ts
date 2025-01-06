import type { MDXComponents } from 'mdx/types';

import Callout from '@/mdx/Callout';
import Cards from '@/mdx/Cards';
import Card from '@/mdx/Cards/Card';
import FileTree from '@/mdx/FileTree';
import Steps from '@/mdx/Steps';
import Tabs from '@/mdx/Tabs';
import Tab from '@/mdx/Tabs/Tab';

import Image from './Image';
import Link from './Link';
import Video from './Video';

const mdxComponents: MDXComponents = {
  Callout,
  Card,
  Cards,
  FileTree,
  Image,
  Steps,
  Tab,
  Tabs,
  Video,
  a: Link,
} as MDXComponents;

export default mdxComponents;
