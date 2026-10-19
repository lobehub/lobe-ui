import { render } from '@testing-library/react';

import Table from '../Table';

describe('Table stable classes', () => {
  it('keeps the inner .lobe-table node as the block and names the outer root the wrapper', () => {
    const { container } = render(
      <Table
        className="user-root"
        classNames={{ header: { cell: 'user-header-cell' } }}
        columns={[{ dataIndex: 'name', key: 'name', title: 'Name' }]}
        dataSource={[{ key: '1', name: 'Alpha' }]}
      />,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    const block = container.querySelector<HTMLElement>('.lobe-table')!;

    expect(wrapper.classList.contains('lobe-table__wrapper')).toBe(true);
    expect(wrapper.classList.contains('user-root')).toBe(true);
    expect(wrapper.contains(block)).toBe(true);
    expect(block.classList.contains('lobe-table__wrapper')).toBe(false);
    expect(block.dataset.variant).toBe('borderless');

    const headerCell = container.querySelector('th')!;
    expect(headerCell.classList.contains('lobe-table__header-cell')).toBe(true);
    expect(headerCell.classList.contains('user-header-cell')).toBe(true);
    expect(container.querySelector('td')?.classList.contains('lobe-table__body-cell')).toBe(true);
  });
});
