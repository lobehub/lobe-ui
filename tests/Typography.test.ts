import { render } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';

import { Typography } from '../src/Markdown/Typography';

describe('Typography', () => {
  it('should render correctly with default props', () => {
    const { container } = render(React.createElement(Typography, null, 'Test content'));
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render with custom fontSize', () => {
    const { container } = render(React.createElement(Typography, { fontSize: 16 }, 'Test content'));
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render with custom headerMultiple', () => {
    const { container } = render(
      React.createElement(Typography, { headerMultiple: 1.5 }, 'Test content'),
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render with custom marginMultiple', () => {
    const { container } = render(
      React.createElement(Typography, { marginMultiple: 3 }, 'Test content'),
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render with custom lineHeight', () => {
    const { container } = render(
      React.createElement(Typography, { lineHeight: 2 }, 'Test content'),
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render with custom className', () => {
    const { container } = render(
      React.createElement(Typography, { className: 'custom-class' }, 'Test content'),
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render with multiple props', () => {
    const { container } = render(
      React.createElement(
        Typography,
        {
          className: 'custom-class',
          fontSize: 14,
          headerMultiple: 1.2,
          lineHeight: 1.5,
          marginMultiple: 2.5,
        },
        'Test content',
      ),
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render with default marginMultiple when not provided', () => {
    const { container } = render(React.createElement(Typography, null, 'Test content'));
    expect(container.firstChild).toMatchSnapshot();
  });
});
