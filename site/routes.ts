import { index, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  index('./app/routes/document.tsx', { id: 'document-home' }),
  route('changelog', './app/routes/document.tsx', { id: 'document-changelog' }),
  route('components/*', './app/routes/document.tsx', { id: 'document-component' }),
  route('~demos/:demoId', './app/routes/standalone-demo.tsx', { id: 'standalone-demo' }),
  route('*', './app/routes/not-found.tsx'),
] satisfies RouteConfig;
