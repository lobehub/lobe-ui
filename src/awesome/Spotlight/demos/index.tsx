import { Spotlight, SpotlightProps } from '@lobehub/ui/awesome';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { createStyles } from 'antd-style';

const useStyles = createStyles(({ css, token }) => ({
  card: css`
    position: relative;

    width: 100%;
    height: 36px;

    background: ${token.colorBgLayout};
    border: 1px solid ${token.colorBorder};
    border-radius: ${token.borderRadius}px;
  `,
}));

export default () => {
  const store = useCreateStore();
  const { styles } = useStyles();
  const control: SpotlightProps | any = useControls(
    {
      size: 64,
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <div className={styles.card}>
        <Spotlight {...control} />
      </div>
    </StoryBook>
  );
};
