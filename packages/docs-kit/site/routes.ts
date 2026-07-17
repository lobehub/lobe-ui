import { index, layout, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  route('antd.css', './app/routes/antd-css.ts'),
  route('theme-vars.css', './app/routes/theme-vars-css.ts'),
  route('~demos/:demoId', './app/routes/standalone-demo.tsx', { id: 'standalone-demo' }),
  layout('./app/routes/docs-layout.tsx', [
    index('./app/routes/home.tsx'),
    route('*', './app/routes/document.tsx', { id: 'document' }),
  ]),
] satisfies RouteConfig;
