import { createStaticStyles, List, type ListProps } from '@lobehub/ui';

const styles = createStaticStyles(({ css }) => ({
  railItem: css`
    justify-content: center;
    padding-inline: 0;

    /* stylelint-disable-next-line selector-class-pattern -- List exposes this stable BEM class. */
    .lobe-list__body {
      position: absolute;
      clip-path: inset(50%);
    }
  `,
}));

export const DemoNavList = ({ expand, style, ...props }: ListProps & { expand: boolean }) => (
  <List
    classNames={expand ? undefined : { item: styles.railItem }}
    style={{ marginInline: expand ? 8 : 6, ...style }}
    {...props}
  />
);
