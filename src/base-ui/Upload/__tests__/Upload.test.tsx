import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import Upload from '../Upload';
import UploadDragger from '../UploadDragger';

const file = (name: string, type = 'text/plain') => new File(['content'], name, { type });

const selectFiles = (input: HTMLInputElement, files: File[]) => {
  Object.defineProperty(input, 'files', { configurable: true, value: files });
  fireEvent.change(input);
};

const dropFiles = (target: Element, files: File[]) => {
  fireEvent.drop(target, { dataTransfer: { files } });
};

describe('Upload', () => {
  afterEach(cleanup);

  test('clicking the trigger opens the file dialog', () => {
    const { container } = render(<Upload />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const clickSpy = vi.spyOn(input, 'click');

    fireEvent.click(screen.getByRole('button'));

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  test.each(['Enter', ' '])('%s key opens the file dialog', (key) => {
    const { container } = render(<Upload />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const clickSpy = vi.spyOn(input, 'click');

    fireEvent.keyDown(screen.getByRole('button'), { key });

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  test('selecting files calls beforeUpload per file with (file, fileList)', async () => {
    const beforeUpload = vi.fn().mockReturnValue(true);
    const { container } = render(<Upload multiple beforeUpload={beforeUpload} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const files = [file('a.txt'), file('b.txt')];

    selectFiles(input, files);

    await waitFor(() => expect(beforeUpload).toHaveBeenCalledTimes(2));
    expect(beforeUpload).toHaveBeenNthCalledWith(1, files[0], files);
    expect(beforeUpload).toHaveBeenNthCalledWith(2, files[1], files);
  });

  test('beforeUpload returning false drops that file', async () => {
    const onFiles = vi.fn();
    const beforeUpload = (f: File) => f.name !== 'b.txt';
    const { container } = render(<Upload multiple beforeUpload={beforeUpload} onFiles={onFiles} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const files = [file('a.txt'), file('b.txt')];

    selectFiles(input, files);

    await waitFor(() => expect(onFiles).toHaveBeenCalledTimes(1));
    expect(onFiles.mock.calls[0][0].map((f: File) => f.name)).toEqual(['a.txt']);
  });

  test('beforeUpload resolving to false (Promise) drops that file', async () => {
    const onFiles = vi.fn();
    const beforeUpload = async (f: File) => f.name !== 'b.txt';
    const { container } = render(<Upload multiple beforeUpload={beforeUpload} onFiles={onFiles} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const files = [file('a.txt'), file('b.txt')];

    selectFiles(input, files);

    await waitFor(() => expect(onFiles).toHaveBeenCalledTimes(1));
    expect(onFiles.mock.calls[0][0].map((f: File) => f.name)).toEqual(['a.txt']);
  });

  test('beforeUpload rejecting drops that file without an unhandled rejection', async () => {
    const onFiles = vi.fn();
    const beforeUpload = (f: File) =>
      f.name === 'b.txt' ? Promise.reject(new Error('nope')) : Promise.resolve(true);
    const { container } = render(<Upload multiple beforeUpload={beforeUpload} onFiles={onFiles} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const files = [file('a.txt'), file('b.txt')];

    selectFiles(input, files);

    await waitFor(() => expect(onFiles).toHaveBeenCalledTimes(1));
    expect(onFiles.mock.calls[0][0].map((f: File) => f.name)).toEqual(['a.txt']);
  });

  test('maxCount slices the accepted files', async () => {
    const onFiles = vi.fn();
    const { container } = render(<Upload multiple maxCount={1} onFiles={onFiles} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const files = [file('a.txt'), file('b.txt')];

    selectFiles(input, files);

    await waitFor(() => expect(onFiles).toHaveBeenCalledTimes(1));
    expect(onFiles.mock.calls[0][0].map((f: File) => f.name)).toEqual(['a.txt']);
  });

  test('onFiles is called once with the accepted files', async () => {
    const onFiles = vi.fn();
    const { container } = render(<Upload multiple onFiles={onFiles} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const files = [file('a.txt'), file('b.txt')];

    selectFiles(input, files);

    await waitFor(() => expect(onFiles).toHaveBeenCalledTimes(1));
    expect(onFiles).toHaveBeenCalledWith(files);
  });

  test('onChange is called once per accepted file', async () => {
    const onChange = vi.fn();
    const { container } = render(<Upload multiple onChange={onChange} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const files = [file('a.txt'), file('b.txt')];

    selectFiles(input, files);

    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(2));
    expect(onChange).toHaveBeenNthCalledWith(1, { file: files[0], fileList: files });
    expect(onChange).toHaveBeenNthCalledWith(2, { file: files[1], fileList: files });
  });

  test('resets the input value after selection', async () => {
    const { container } = render(<Upload />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    selectFiles(input, [file('a.txt')]);

    await waitFor(() => expect(input.value).toBe(''));
  });

  test('disabled blocks click', () => {
    const { container } = render(<Upload disabled />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const clickSpy = vi.spyOn(input, 'click');

    fireEvent.click(screen.getByRole('button'));

    expect(clickSpy).not.toHaveBeenCalled();
  });

  test('clicking a button child opens the dialog exactly once', () => {
    const { container } = render(
      <Upload>
        <button type="button">Upload file</button>
      </Upload>,
    );
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const clickSpy = vi.spyOn(input, 'click');

    fireEvent.click(screen.getByText('Upload file'));

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  test('sets webkitdirectory on the input when directory is set', () => {
    const { container } = render(<Upload directory />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    expect(input.getAttribute('webkitdirectory')).toBe('');
  });

  test('openFileDialogOnClick=false blocks click', () => {
    const { container } = render(<Upload openFileDialogOnClick={false} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const clickSpy = vi.spyOn(input, 'click');

    fireEvent.click(screen.getByRole('button'));

    expect(clickSpy).not.toHaveBeenCalled();
  });

  test('forwards a ref to the root element', () => {
    let node: HTMLElement | null = null;
    render(
      <Upload
        ref={(el) => {
          node = el;
        }}
      />,
    );
    expect(node).toBeInstanceOf(HTMLSpanElement);
  });
});

describe('Upload dragger', () => {
  afterEach(cleanup);

  test('renders a dragger with the default icon and title', () => {
    render(<Upload dragger title="Drop files here" />);
    expect(screen.getByText('Drop files here')).toBeTruthy();
    expect(screen.getByRole('button').querySelector('svg')).toBeTruthy();
  });

  test('drop feeds the accept pipeline, filtering non-matching files', async () => {
    const onFiles = vi.fn();
    render(<Upload dragger multiple accept="image/*" onFiles={onFiles} />);
    const dropzone = screen.getByRole('button');
    const files = [file('a.png', 'image/png'), file('b.pdf', 'application/pdf')];

    dropFiles(dropzone, files);

    await waitFor(() => expect(onFiles).toHaveBeenCalledTimes(1));
    expect(onFiles.mock.calls[0][0].map((f: File) => f.name)).toEqual(['a.png']);
  });

  test('disabled blocks drop', async () => {
    const onFiles = vi.fn();
    render(<Upload disabled dragger onFiles={onFiles} />);
    const dropzone = screen.getByRole('button');

    dropFiles(dropzone, [file('a.txt')]);

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(onFiles).not.toHaveBeenCalled();
  });

  test('UploadDragger is a drop-in for Upload dragger', () => {
    render(<UploadDragger title="Drop here" />);
    expect(screen.getByText('Drop here')).toBeTruthy();
  });
});
