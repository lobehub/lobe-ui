import { index, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  index('./app/routes/home.tsx'),
  route('*', './app/routes/not-found.tsx'),
] satisfies RouteConfig;
