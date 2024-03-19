import {
  ActionIconGroup,
  ChatItem,
  ChatItemProps,
  StoryBook,
  useControls,
  useCreateStore,
} from '@lobehub/ui';
import { useState } from 'react';

import { avatar, dropdownMenu, items } from './data';

export default () => {
  const [edit, setEdit] = useState(false);
  const store = useCreateStore();
  const control: ChatItemProps | any = useControls(
    {
      loading: false,
      message: {
        rows: true,
        value:
          "要使用 dayjs 的 fromNow 函数，需要先安装 dayjs 库并在代码中引入它。然后，可以使用以下语法来获取当前时间与给定时间之间的相对时间：\n\n```'use client';\n" +
          '\n' +
          "import { Space } from 'antd';\n" +
          "import { memo } from 'react';\n" +
          "import { Flexbox } from 'react-layout-kit';\n" +
          '\n' +
          "import { ColorScaleItem } from '@/styles/colors/colors';\n" +
          '\n' +
          "import ScaleRow from './ScaleRow';\n" +
          "import { useStyles } from './style';\n" +
          '\n' +
          'export interface ColorScalesProps {\n' +
          '  /**\n' +
          '   * @description Index of the mid highlight color in the scale\n' +
          '   */\n' +
          '  midHighLight: number;\n' +
          '  /**\n' +
          '   * @description Name of the color scale\n' +
          '   */\n' +
          '  name: string;\n' +
          '  /**\n' +
          '   * @description Color scale item object\n' +
          '   */\n' +
          '  scale: ColorScaleItem;\n' +
          '}\n' +
          '\n' +
          'const ColorScales = memo<ColorScalesProps>(({ name, scale, midHighLight }) => {\n' +
          '  const { styles } = useStyles();\n' +
          '\n' +
          '  return (\n' +
          "    <Flexbox align={'center'} flex={1} horizontal justify={'center'}>\n" +
          "      <div style={{ padding: '8px 16px 32px 0' }}>\n" +
          "        <Space direction={'vertical'} size={2}>\n" +
          '          <Space key="scale-title" size={2}>\n' +
          '            <Flexbox align={\'center\'} className={styles.scaleRowTitle} horizontal key="scale-num" />\n' +
          '            {Array.from({ length: scale.light.length })\n' +
          "              .fill('')\n" +
          '              .map((_, index) => {\n' +
          '                if (index === 0 || index === 12) return false;\n' +
          '\n' +
          '                const isMidHighlight = midHighLight === index;\n' +
          '\n' +
          '                return (\n' +
          '                  <div className={styles.scaleBox} key={`num${index}`}>\n' +
          '                    <div className={styles.scaleBox}>\n' +
          '                      <Flexbox\n' +
          "                        align={'center'}\n" +
          '                        className={styles.scaleItem}\n' +
          '                        horizontal\n' +
          "                        justify={'center'}\n" +
          '                        style={{\n' +
          '                          fontWeight: isMidHighlight ? 700 : 400,\n' +
          '                          opacity: 0.5,\n' +
          '                        }}\n' +
          '                      >\n' +
          '                        {index}\n' +
          '                      </Flexbox>\n' +
          '                    </div>\n' +
          '                  </div>\n' +
          '                );\n' +
          '              })}\n' +
          '          </Space>\n' +
          '          <ScaleRow key="light" name={name} scale={scale.light} title="light" />\n' +
          '          <ScaleRow key="lightA" name={name} scale={scale.lightA} title="lightA" />\n' +
          '          <ScaleRow key="dark" name={name} scale={scale.dark} title="dark" />\n' +
          '          <ScaleRow key="darkA" name={name} scale={scale.darkA} title="darkA" />\n' +
          '        </Space>\n' +
          '      </div>\n' +
          '    </Flexbox>\n' +
          '  );\n' +
          '});\n' +
          '\n' +
          'export default ColorScales;\n```',
      },
      placement: {
        options: ['left', 'right'],
        value: 'left',
      },
      primary: false,
      showTitle: false,
      time: 1_686_538_950_084,
      type: {
        options: ['block', 'pure'],
        value: 'block',
      },
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <ChatItem
        {...control}
        actions={
          <ActionIconGroup
            dropdownMenu={dropdownMenu}
            items={items}
            onActionClick={(action) => {
              if (action.key === 'edit') {
                setEdit(true);
              }
            }}
            type="ghost"
          />
        }
        avatar={avatar}
        editing={edit}
        onEditingChange={setEdit}
      />
    </StoryBook>
  );
};
