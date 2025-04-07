export const code = `import { CSSProperties, memo } from 'react';

const HelloWorld = memo(({ className, style }) => {
  return (
    <h1 className={className} style={style}>
      Hello World
    </h1>
  );
});

export default HelloWorld;
`;
