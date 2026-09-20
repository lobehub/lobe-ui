import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Package } from 'lucide-react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Empty from './Empty';

describe('Empty', () => {
  afterEach(cleanup);

  it('renders nothing above the title when no icon/emoji/image is given', () => {
    const { container } = render(<Empty title="No data" />);

    expect(container.querySelector('svg')).toBeNull();
    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByText('No data')).toBeTruthy();
  });

  it('renders the given icon for the default variant', () => {
    const { container } = render(<Empty icon={Package} title="No data" />);

    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('image takes precedence over emoji and icon', () => {
    render(
      <Empty
        emoji="📭"
        icon={Package}
        image={<span data-testid="custom-image" />}
        title="No data"
      />,
    );

    expect(screen.getByTestId('custom-image')).toBeTruthy();
  });

  it('emoji takes precedence over icon', () => {
    const { container } = render(<Empty emoji="📭" icon={Package} title="No data" />);

    expect(screen.getByAltText('📭')).toBeTruthy();
    expect(container.querySelector('svg')).toBeNull();
  });

  it('renders a default Plus icon only for the clickable dashed variant', () => {
    const { container: withoutClick } = render(<Empty title="No skills yet" variant="dashed" />);
    const { container: withClick } = render(
      <Empty title="No skills yet" variant="dashed" onClick={() => {}} />,
    );

    expect(withoutClick.querySelector('svg')).toBeNull();
    expect(withClick.querySelector('svg')).toBeTruthy();
  });

  it('only applies the pointer cursor on the dashed variant when onClick is passed', () => {
    const { container: withoutClick } = render(<Empty title="No skills yet" variant="dashed" />);
    const { container: withClick } = render(
      <Empty title="No skills yet" variant="dashed" onClick={() => {}} />,
    );

    expect(getComputedStyle(withoutClick.firstChild as Element).cursor).not.toBe('pointer');
    expect(getComputedStyle(withClick.firstChild as Element).cursor).toBe('pointer');
  });

  it('fires onClick on the dashed variant', () => {
    const onClick = vi.fn();
    const { container } = render(
      <Empty title="No skills yet" variant="dashed" onClick={onClick} />,
    );

    fireEvent.click(container.firstChild as Element);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('exposes button semantics and fires onClick on Enter/Space for the clickable dashed variant', () => {
    const onClick = vi.fn();
    const { container } = render(
      <Empty title="No skills yet" variant="dashed" onClick={onClick} />,
    );

    const root = container.firstChild as HTMLElement;

    expect(root.getAttribute('role')).toBe('button');
    expect(root.getAttribute('tabindex')).toBe('0');

    fireEvent.keyDown(root, { key: 'Enter' });
    fireEvent.keyDown(root, { key: ' ' });
    fireEvent.keyDown(root, { key: 'a' });

    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('renders a row layout with a left icon for type="page"', () => {
    render(
      <Empty
        description="Upload documents to get started."
        icon={Package}
        title="No files in this project"
        type="page"
      />,
    );

    expect(screen.getByText('No files in this project')).toBeTruthy();
    expect(screen.getByText('Upload documents to get started.')).toBeTruthy();
  });

  it('applies align to the row container for type="page"', () => {
    const { container } = render(
      <Empty align="center" title="No files in this project" type="page" />,
    );

    expect(getComputedStyle(container.firstElementChild as Element).alignItems).toBe('center');
  });

  it('renders the action inside the text block for type="page"', () => {
    render(
      <Empty
        action={<button type="button">Upload files</button>}
        title="No files in this project"
        type="page"
      />,
    );

    expect(screen.getByText('Upload files')).toBeTruthy();
  });

  it('renders the action for the default type', () => {
    render(<Empty action={<button type="button">Retry</button>} title="No data" />);

    expect(screen.getByText('Retry')).toBeTruthy();
  });

  it('renders children and forwards className', () => {
    const { container } = render(
      <Empty className="custom" title="No data">
        <div>Details</div>
      </Empty>,
    );

    expect(screen.getByText('Details')).toBeTruthy();
    expect(container.firstChild).toHaveProperty('className', expect.stringContaining('custom'));
  });

  it('sets the displayName', () => {
    expect(Empty.displayName).toBe('Empty');
  });
});
