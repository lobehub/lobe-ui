'use client';

import { createGlobalStyle } from 'antd-style';

import antdOverride from './antdOverride';
import global from './global';

const GlobalStyle = createGlobalStyle(({ theme }) => [global(theme), antdOverride(theme)]);

export default GlobalStyle;
