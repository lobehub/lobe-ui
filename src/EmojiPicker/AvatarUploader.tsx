'use client';

import { type GetProp, Upload, type UploadProps, message } from 'antd';
import { useTheme } from 'antd-style';
import { ChevronLeftIcon, ImageUpIcon } from 'lucide-react';
import { memo, useCallback, useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';

import Button from '@/Button';
import { Center, Flexbox } from '@/Flex';
import Icon from '@/Icon';
import Tag from '@/Tag';
import Text from '@/Text';
import emojiPickerMessages from '@/i18n/resources/emojiPicker';
import { useTranslation } from '@/i18n/useTranslation';

import { AvatarUploaderProps } from './type';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const { Dragger } = Upload;

const createUploadImageHandler = (onUploadImage: (base64: string) => void) => (file: any) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.addEventListener('load', () => {
    onUploadImage(String(reader.result));
  });
};

const AvatarUploader = memo<AvatarUploaderProps>(
  ({ shape, onChange, texts, compressSize = 256, onUpload }) => {
    const editor = useRef<any>(null);
    const [previewImage, setPreviewImage] = useState('');
    const theme = useTheme();
    const { t } = useTranslation(emojiPickerMessages);

    const fileTypeErrorText = texts?.fileTypeError ?? t('emojiPicker.fileTypeError');
    const draggerDescText = texts?.draggerDesc ?? t('emojiPicker.draggerDesc');
    const uploadBtnText = texts?.uploadBtn ?? t('emojiPicker.uploadBtn');

    const beforeUpload = useCallback(
      (file: FileType) => {
        const isJpgOrPng =
          file.type === 'image/jpeg' ||
          file.type === 'image/png' ||
          file.type === 'image/gif' ||
          file.type === 'image/webp';
        if (!isJpgOrPng) {
          message.error(fileTypeErrorText);
          return;
        }
        return createUploadImageHandler((avatar) => {
          setPreviewImage(avatar);
        })(file);
      },
      [fileTypeErrorText],
    );

    const handleUpload = () => {
      if (!editor.current) return;
      const canvasScaled = editor.current.getImageScaledToCanvas() as HTMLCanvasElement;
      const dataUrl = canvasScaled.toDataURL();
      onChange(dataUrl);

      if (!onUpload) return;

      // 使用 toBlob 直接获取 Blob，然后创建 File 对象
      canvasScaled.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], 'avatar.webp', { type: 'image/webp' });
            onUpload(file);
          }
        },
        'image/webp',
        0.95,
      ); // 0.95 是图片质量
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
              <Icon color={theme.colorTextDescription} icon={ImageUpIcon} size={48} />
              <Text color={theme.colorTextSecondary}>{draggerDescText}</Text>
              <Center gap={4} horizontal>
                <Tag>JPG</Tag>
                <Tag>PNG</Tag>
                <Tag>GIF</Tag>
                <Tag>WEBP</Tag>
              </Center>
            </Center>
          </Dragger>
        )}
        {previewImage && (
          <Center gap={8} style={{ position: 'relative' }} width={'100%'}>
            <AvatarEditor
              border={0}
              borderRadius={shape === 'square' ? undefined : compressSize / 2}
              height={compressSize}
              image={previewImage}
              ref={editor}
              width={compressSize}
            />

            <Flexbox gap={8} horizontal style={{ position: 'relative' }} width={'100%'}>
              <Button
                icon={ChevronLeftIcon}
                onClick={() => setPreviewImage('')}
                style={{ flex: 'none' }}
              />
              <Button onClick={handleUpload} style={{ flex: 1, fontWeight: 500 }} type={'primary'}>
                {uploadBtnText}
              </Button>
            </Flexbox>
          </Center>
        )}
      </Flexbox>
    );
  },
);

AvatarUploader.displayName = 'AvatarUploader';

export default AvatarUploader;
