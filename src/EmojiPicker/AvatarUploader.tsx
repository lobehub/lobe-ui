import { Button, type GetProp, Upload, type UploadProps, message } from 'antd';
import { ChevronLeftIcon, ImageUpIcon } from 'lucide-react';
import { memo, useCallback, useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { Center, Flexbox } from 'react-layout-kit';

import Icon from '@/Icon';

import { useStyles } from './style';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const { Dragger } = Upload;

const createUploadImageHandler = (onUploadImage: (base64: string) => void) => (file: any) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.addEventListener('load', () => {
    onUploadImage(String(reader.result));
  });
};

export interface AvatarUploaderProps {
  compressSize?: number;
  onChange: (avatar: string) => void;
  onUpload?: (file: File) => void;
  texts?: {
    draggerDesc?: string;
    fileTypeError?: string;
    uploadBtn?: string;
  };
}

const AvatarUploader = memo<AvatarUploaderProps>(
  ({ onChange, texts, compressSize = 256, onUpload }) => {
    const editor = useRef<any>(null);
    const [previewImage, setPreviewImage] = useState('');
    const { styles } = useStyles();

    const beforeUpload = useCallback((file: FileType) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error(texts?.fileTypeError || 'You can only upload JPG/PNG file!');
        return;
      }
      return createUploadImageHandler((avatar) => {
        setPreviewImage(avatar);
      })(file);
    }, []);

    const handleUpload = () => {
      if (!editor.current) return;
      const canvasScaled = editor.current.getImageScaledToCanvas() as HTMLCanvasElement;
      const dataUrl = canvasScaled.toDataURL();
      onChange(dataUrl);
      if (!onUpload) return;
      const file: File = new File([dataUrl], 'avatar.webp', {
        type: 'image/webp',
      });
      onUpload?.(file);
    };

    return (
      <Flexbox padding={10} style={{ position: 'relative' }} width={'100%'}>
        {!previewImage && (
          <Dragger
            accept={'image'}
            beforeUpload={beforeUpload}
            itemRender={() => void 0}
            maxCount={1}
            multiple={false}
          >
            <Center gap={16} height={compressSize} width={compressSize}>
              <Icon icon={ImageUpIcon} size={{ fontSize: 48, strokeWidth: 1.5 }} />
              <div>{texts?.draggerDesc || 'Click or Drag image to this area to upload'}</div>
            </Center>
          </Dragger>
        )}
        {previewImage && (
          <Center gap={8} style={{ position: 'relative' }} width={'100%'}>
            <Flexbox className={styles.editor}>
              <AvatarEditor
                border={0}
                borderRadius={compressSize / 2}
                height={compressSize}
                image={previewImage}
                ref={editor}
                width={compressSize}
              />
            </Flexbox>
            <Flexbox gap={8} horizontal style={{ position: 'relative' }} width={'100%'}>
              <Button
                icon={<Icon icon={ChevronLeftIcon} />}
                onClick={() => setPreviewImage('')}
                style={{ flex: 'none' }}
              />
              <Button onClick={handleUpload} style={{ flex: 1, fontWeight: 500 }} type={'primary'}>
                {texts?.uploadBtn || 'Crop and Upload'}
              </Button>
            </Flexbox>
          </Center>
        )}
      </Flexbox>
    );
  },
);

export default AvatarUploader;
