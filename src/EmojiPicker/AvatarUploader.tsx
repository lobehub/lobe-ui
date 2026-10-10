'use client';

import { ChevronLeftIcon, ImageUpIcon } from 'lucide-react';
import { memo, useCallback, useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';

import Button from '@/base-ui/Button';
import Tag from '@/base-ui/Tag';
import { toast, ToastHost } from '@/base-ui/Toast';
import { UploadDragger } from '@/base-ui/Upload';
import { Center, Flexbox } from '@/Flex';
import emojiPickerMessages from '@/i18n/resources/en/emojiPicker';
import { useTranslation } from '@/i18n/useTranslation';
import Icon from '@/Icon';
import { cssVar } from '@/styles';
import Text from '@/Text';

import { type AvatarUploaderProps } from './type';

const ACCEPTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);

const readAsDataURL = (file: File, onLoad: (dataUrl: string) => void) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.addEventListener('load', () => {
    onLoad(String(reader.result));
  });
};

const AvatarUploader = memo<AvatarUploaderProps>(
  ({ shape, onChange, texts, compressSize = 256, onUpload }) => {
    const editor = useRef<any>(null);
    const [previewImage, setPreviewImage] = useState('');
    const { t } = useTranslation(emojiPickerMessages);

    const fileTypeErrorText = texts?.fileTypeError ?? t('emojiPicker.fileTypeError');
    const draggerDescText = texts?.draggerDesc ?? t('emojiPicker.draggerDesc');
    const uploadBtnText = texts?.uploadBtn ?? t('emojiPicker.uploadBtn');

    const handleFiles = useCallback(
      ([file]: File[]) => {
        if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
          toast.error(fileTypeErrorText);
          return;
        }
        readAsDataURL(file, setPreviewImage);
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
          <UploadDragger maxCount={1} onFiles={handleFiles}>
            <Center gap={16} height={compressSize} width={compressSize}>
              <Icon color={cssVar.colorTextDescription} icon={ImageUpIcon} size={48} />
              <Text color={cssVar.colorTextSecondary}>{draggerDescText}</Text>
              <Center horizontal gap={4}>
                <Tag>JPG</Tag>
                <Tag>PNG</Tag>
                <Tag>GIF</Tag>
                <Tag>WEBP</Tag>
              </Center>
            </Center>
          </UploadDragger>
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

            <Flexbox horizontal gap={8} style={{ position: 'relative' }} width={'100%'}>
              <Button
                icon={ChevronLeftIcon}
                style={{ flex: 'none' }}
                onClick={() => setPreviewImage('')}
              />
              <Button style={{ flex: 1, fontWeight: 500 }} type={'primary'} onClick={handleUpload}>
                {uploadBtnText}
              </Button>
            </Flexbox>
          </Center>
        )}
        <ToastHost />
      </Flexbox>
    );
  },
);

AvatarUploader.displayName = 'AvatarUploader';

export default AvatarUploader;
