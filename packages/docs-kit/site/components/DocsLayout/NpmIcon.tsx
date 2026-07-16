import type { SVGProps } from 'react';

export function NpmIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="#c12127" height={13} viewBox="0 0 14 14" width={13} {...props}>
      <path d="M13 0c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h12Zm-1.625 2.625H2.625v8.75H7v-7h2.625v7h1.75v-8.75Z" />
    </svg>
  );
}
