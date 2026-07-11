import type { MetaFunction } from 'react-router';

export const meta: MetaFunction = () => [
  { title: 'Documentation not found - Lobe UI' },
  { content: 'noindex, nofollow', name: 'robots' },
];

export default function NotFound() {
  return (
    <main>
      <h1>Documentation not found</h1>
      <p>The requested documentation page does not exist.</p>
      <a href="/">Return to the documentation home page</a>
    </main>
  );
}
