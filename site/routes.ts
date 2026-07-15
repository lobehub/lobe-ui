import { index, layout, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  route('antd.css', './app/routes/antd-css.ts'),
  route('~demos/:demoId', './app/routes/standalone-demo.tsx', { id: 'standalone-demo' }),
  layout('./app/routes/docs-layout.tsx', [
    index('./app/routes/home.tsx'),
    route('changelog', './app/routes/document.tsx', { id: 'document-changelog' }),
    route('components/*', './app/routes/document.tsx', { id: 'document-component' }),
    route('*', './app/routes/not-found.tsx'),
  ]),
] satisfies RouteConfig;
