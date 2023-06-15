import { GradientButton, Icon } from '@lobehub/ui';
import { Button, ConfigProvider, Space } from 'antd';
import { useResponsive } from 'antd-style';
import * as LucideIcon from 'lucide-react';
import { memo, useCallback } from 'react';
import { Center, Flexbox } from 'react-layout-kit';

import { useStyles } from './style';

export interface HeroAction {
  icon?: string;
  link: string;
  openExternal?: boolean;
  text: string;
  type?: 'primary' | 'default';
}

export interface HeroProps {
  actions?: HeroAction[];
  description?: string;
  title?: string;
}

const Hero = memo<HeroProps>(({ title, description, actions }) => {
  const { styles } = useStyles();
  const { mobile } = useResponsive();

  const ButtonGroups = useCallback(
    () =>
      Boolean(actions?.length) && (
        <Space className={styles.actions} direction={mobile ? 'vertical' : 'horizontal'} size={24}>
          {actions!.map(({ text, link, openExternal, icon, type }, index) => {
            // @ts-ignore
            const ButtonIcon = icon && LucideIcon[icon];

            return (
              <a
                href={link}
                key={text}
                rel="noreferrer"
                target={openExternal ? '_blank' : undefined}
              >
                {type === 'primary' ? (
                  <GradientButton key={index} size="large">
                    {text}
                  </GradientButton>
                ) : (
                  <Button key={index} size="large" type="primary">
                    <Space align="center">
                      {ButtonIcon && (
                        <Icon icon={ButtonIcon} size={{ fontSize: 18, strokeWidth: 2 }} />
                      )}
                      {text}
                    </Space>
                  </Button>
                )}
              </a>
            );
          })}
        </Space>
      ),
    [actions],
  );

  return (
    <ConfigProvider theme={{ token: { fontSize: 16 } }}>
      <Flexbox className={styles.container} distribution={'center'} horizontal>
        <div className={styles.canvas}></div>
        <Center>
          {title && <h1 className={styles.title} dangerouslySetInnerHTML={{ __html: title }} />}
          {description && (
            <p className={styles.desc} dangerouslySetInnerHTML={{ __html: description }} />
          )}
          <ButtonGroups />
        </Center>
      </Flexbox>
    </ConfigProvider>
  );
});

export default Hero;
