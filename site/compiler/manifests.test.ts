import { getPrerenderPaths } from './manifests';

it('adds both frozen and canonical standalone demo paths to prerender inputs', () => {
  const paths = getPrerenderPaths();

  expect(paths).toContain('/~demos/src-button-demo-demos');
  expect(paths).toContain('/~demos/src-button-demos-index');
  expect(paths).toContain('/~demos/file, filetree, folder-demo-demos');
  expect(paths).not.toContain('/~demos/file%2C%20filetree%2C%20folder-demo-demos');
  expect(paths.filter((path) => path.startsWith('/~demos/'))).toHaveLength(698);
  expect(new Set(paths).size).toBe(paths.length);
});

it('prerenders a real not-found document for the root 404 artifact', () => {
  expect(getPrerenderPaths()).toContain('/404');
});
