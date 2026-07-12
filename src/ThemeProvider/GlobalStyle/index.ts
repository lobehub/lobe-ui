'use client';

import { createGlobalStyle } from 'antd-style';

import antdOverride from './antdOverride';
import essential from './essential';
import global from './global';

const GlobalStyle = createGlobalStyle(({ theme }) => global(theme));

export const EssentialStyle = createGlobalStyle(({ theme }) => [
  essential(theme),
  antdOverride(theme),
]);

export default GlobalStyle;
