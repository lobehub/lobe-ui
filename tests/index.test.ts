import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';

import { SearchResultCard } from '../src/SearchResultCard';

describe('SearchResultCard', () => {
  it('should render with valid URL', () => {
    const props = {
      alt: 'Example Alt',
      title: 'Example Title',
      url: 'https://www.example.com/path',
    };

    render(React.createElement(SearchResultCard, props));

    expect(screen.getByText('Example Title')).toBeTruthy();
    expect(screen.getByText('example.com')).toBeTruthy();
    expect(screen.getByAltText('Example Alt')).toBeTruthy();
  });

  it('should render with URL as title when title matches URL', () => {
    const props = {
      title: 'https://www.example.com/path',
      url: 'https://www.example.com/path',
    };

    render(React.createElement(SearchResultCard, props));

    expect(screen.getByText('www.example.com/path')).toBeTruthy();
  });

  it('should handle invalid URL', () => {
    const props = {
      title: 'Invalid URL Title',
      url: 'invalid-url',
    };

    render(React.createElement(SearchResultCard, props));

    expect(screen.getByText('Invalid URL Title')).toBeTruthy();
    expect(screen.getByText('invalid-url')).toBeTruthy();
  });

  it('should render with minimal props', () => {
    const props = {
      url: 'https://example.com',
    };

    render(React.createElement(SearchResultCard, props));

    expect(screen.getByText('example.com')).toBeTruthy();
  });

  it('should use url as alt text when title and alt are not provided', () => {
    const props = {
      url: 'https://example.com',
    };

    render(React.createElement(SearchResultCard, props));

    expect(screen.getByAltText('https://example.com')).toBeTruthy();
  });

  it('should use title as alt text when alt is not provided', () => {
    const props = {
      title: 'Example Title',
      url: 'https://example.com',
    };

    render(React.createElement(SearchResultCard, props));

    expect(screen.getByAltText('Example Title')).toBeTruthy();
  });
});
