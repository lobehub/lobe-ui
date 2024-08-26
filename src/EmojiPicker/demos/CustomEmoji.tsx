import { EmojiPicker } from '@lobehub/ui';

const LOGO = 'https://registry.npmmirror.com/@lobehub/assets-logo/1.2.0/files/assets/logo-3d.webp';

export default () => (
  <EmojiPicker
    customEmojis={[
      {
        emojis: [
          {
            id: 'logo',
            keywords: ['lobechat', 'lobehub'],
            name: 'LobeHub Logo',
            skins: [
              {
                src: LOGO,
              },
            ],
          },
        ],
        id: 'lobehub',
        name: 'LobeHub',
      },
    ]}
    defaultAvatar={LOGO}
  />
);
