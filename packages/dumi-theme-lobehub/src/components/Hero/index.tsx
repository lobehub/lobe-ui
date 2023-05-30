import { IAction } from '@/types';
import { Button, ConfigProvider } from 'antd';
import { Link } from 'dumi';
import { memo } from 'react';
import { Center, Flexbox } from 'react-layout-kit';
import HeroButton from './HeroButton';
import { useStyles } from './style';

export interface HeroProps {
  /**
   * @title 标题
   * @description 头图组件的标题，可选
   */
  title?: string;
  /**
   * @title 描述
   * @description 描述，可选
   */
  description?: string;
  /**
   * @title 操作
   * @description 操作按钮，可选
   * @typedef {Object} Action
   * @property {string} text - 操作按钮的文本
   * @property {string} link - 操作按钮跳转的链接
   * @property {boolean} openExternal - 是否打开外部链接
   * @type {Action[]}
   */
  actions?: IAction[];
}

const Hero = memo<HeroProps>(({ title, description, actions }) => {
  const { styles, cx } = useStyles();

  return (
    <Flexbox horizontal distribution={'center'} className={styles.container}>
      <div className={styles.canvas}></div>
      <Center>
        {title && (
          <div className={styles.titleContainer}>
            <h1 className={styles.title} dangerouslySetInnerHTML={{ __html: title }} />
            <div
              className={cx(styles.titleShadow)}
              dangerouslySetInnerHTML={{ __html: title }}
            ></div>
          </div>
        )}
        {description && (
          <p className={styles.desc} dangerouslySetInnerHTML={{ __html: description }} />
        )}
        {Boolean(actions?.length) && (
          <ConfigProvider theme={{ token: { fontSize: 16, controlHeight: 40 } }}>
            <Flexbox horizontal gap={24} className={styles.actions}>
              {actions!.map(({ text, link, openExternal }, index) => (
                <Link
                  key={text}
                  to={link}
                  target={openExternal ? '_blank' : undefined}
                  rel="noreferrer"
                >
                  {index === 0 ? (
                    <HeroButton>{text}</HeroButton>
                  ) : (
                    <Button size={'large'} shape={'round'} type={'default'}>
                      {text}
                    </Button>
                  )}
                </Link>
              ))}
            </Flexbox>
          </ConfigProvider>
        )}
      </Center>
    </Flexbox>
  );
});

export default Hero;
