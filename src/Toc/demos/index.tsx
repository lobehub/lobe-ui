import { Toc } from '@lobehub/ui';

export default () => {
  const items = [
    { href: '#introduction', level: 2 as const, title: 'Introduction' },
    { href: '#getting-started', level: 2 as const, title: 'Getting Started' },
    { href: '#installation', level: 3 as const, title: 'Installation' },
    { href: '#configuration', level: 3 as const, title: 'Configuration' },
    { href: '#usage', level: 2 as const, title: 'Usage' },
    { href: '#basic-example', level: 3 as const, title: 'Basic Example' },
    { href: '#advanced-features', level: 2 as const, title: 'Advanced Features' },
  ];

  return (
    <div style={{ display: 'flex', gap: 32 }}>
      <div style={{ flex: 1, maxWidth: 600 }}>
        <h2 id="introduction">Introduction</h2>
        <p>
          The Toc component provides a table of contents with an animated SVG outline rail that
          bends between different heading levels.
        </p>

        <h2 id="getting-started">Getting Started</h2>
        <p>Follow these steps to get started with the Toc component.</p>

        <h3 id="installation">Installation</h3>
        <p>Install the package using your preferred package manager.</p>

        <h3 id="configuration">Configuration</h3>
        <p>Configure the component with your desired props.</p>

        <h2 id="usage">Usage</h2>
        <p>Basic usage examples of the Toc component.</p>

        <h3 id="basic-example">Basic Example</h3>
        <p>Here's a simple example to get you started.</p>

        <h2 id="advanced-features">Advanced Features</h2>
        <p>Explore advanced features and customization options.</p>
      </div>

      <div style={{ width: 200 }}>
        <Toc items={items} offset={80} />
      </div>
    </div>
  );
};
