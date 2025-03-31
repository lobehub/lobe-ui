'use client';

import { Drawer as AntdDrawer, type DrawerProps as AntdDrawerProps } from 'antd';
import { useTheme } from 'antd-style';
import { XIcon } from 'lucide-react';
import { CSSProperties, ReactNode, memo, useMemo } from 'react';
import { Flexbox } from 'react-layout-kit';

import ActionIcon, { type ActionIconProps } from '@/ActionIcon';

export interface DrawerProps extends Omit<AntdDrawerProps, 'styles' | 'classNames'> {
  classNames?: AntdDrawerProps['classNames'] & {
    bodyContent?: string;
    extra?: string;
    sidebar?: string;
    sidebarContent?: string;
    title?: string;
  };
  closeIconProps?: ActionIconProps;
  containerMaxWidth?: number;
  noHeader?: boolean;
  sidebar?: ReactNode;
  sidebarWidth?: number;
  styles?: AntdDrawerProps['styles'] & {
    bodyContent?: CSSProperties;
    extra?: CSSProperties;
    sidebar?: CSSProperties;
    sidebarContent?: CSSProperties;
    title?: CSSProperties;
  };
}

const Drawer = memo<DrawerProps>(
  ({
    onClose,
    containerMaxWidth = 1024,
    classNames,
    title,
    placement,
    styles,
    children,
    height,
    width,
    extra,
    closeIconProps,
    noHeader,
    sidebarWidth = 280,
    sidebar,
    closeIcon,
    ...rest
  }) => {
    const theme = useTheme();

    const headerBorder: CSSProperties = useMemo(() => {
      if (height === '100%' || width === '100%' || height === '100vh' || width === '100vw')
        return {};

      switch (placement) {
        case 'top': {
          return {
            borderBottom: `1px solid ${theme.colorBorder}`,
          };
        }
        case 'bottom': {
          return {
            borderTop: `1px solid ${theme.colorBorder}`,
          };
        }
        case 'left': {
          return {
            borderRight: `1px solid ${theme.colorBorder}`,
          };
        }
        case 'right': {
          return {
            borderLeft: `1px solid ${theme.colorBorder}`,
          };
        }
        default: {
          return {};
        }
      }
    }, [placement, height, width, theme.colorBorder]);

    const extraNode = (
      <Flexbox
        align={'center'}
        className={classNames?.extra}
        gap={4}
        horizontal
        justify={'flex-end'}
        style={{
          position: 'absolute',
          right: 4,
          top: 4,
          ...styles?.extra,
        }}
      >
        {extra}
        {closeIcon || (
          <ActionIcon icon={XIcon} onClick={onClose} size={'site'} {...closeIconProps} />
        )}
      </Flexbox>
    );

    return (
      <AntdDrawer
        classNames={classNames}
        closable={false}
        extra={noHeader ? undefined : extraNode}
        height={height}
        keyboard={true}
        onClose={onClose}
        placement={placement}
        styles={{
          ...styles,
          body: {
            background: 'transparent',
            padding: '0 4px',
            ...styles?.body,
          },
          content: {
            background: sidebar
              ? `linear-gradient(to right, ${theme.colorBgLayout} 49.9%, ${theme.colorBgContainer} 50%)`
              : theme.colorBgContainer,
            ...styles?.content,
          },
          header: {
            background: 'transparent',
            display: noHeader ? 'none' : undefined,
            padding: 4,
            ...styles?.header,
          },
          wrapper: {
            background: theme.colorBgContainer,
            ...headerBorder,
            ...styles?.wrapper,
          },
        }}
        title={
          <Flexbox
            align={'center'}
            className={classNames?.title}
            horizontal
            justify={'flex-start'}
            paddingBlock={8}
            paddingInline={16}
            style={{
              justifySelf: 'center',
              maxWidth: containerMaxWidth,
              width: '100%',
              ...styles?.title,
            }}
          >
            {title}
          </Flexbox>
        }
        width={width}
        {...rest}
      >
        <Flexbox
          className={classNames?.bodyContent}
          height={'100%'}
          horizontal={!!sidebar}
          paddingBlock={sidebar ? undefined : 12}
          paddingInline={sidebar ? undefined : 16}
          style={{
            justifySelf: 'center',
            maxWidth: containerMaxWidth,
            width: '100%',
            ...styles?.bodyContent,
          }}
        >
          {noHeader && extraNode}
          {sidebar ? (
            <>
              <Flexbox
                className={classNames?.sidebar}
                paddingBlock={12}
                paddingInline={16}
                style={{
                  background: theme.colorBgLayout,
                  borderRight: `1px solid ${theme.colorBorderSecondary}`,
                  height: '100%',
                  overflowX: 'hidden',
                  overflowY: 'auto',
                  ...styles?.sidebar,
                }}
                width={sidebarWidth}
              >
                {sidebar}
              </Flexbox>
              <Flexbox
                className={classNames?.sidebarContent}
                flex={1}
                paddingBlock={12}
                paddingInline={16}
                style={{
                  background: theme.colorBgContainer,
                  height: '100%',
                  overflowX: 'hidden',
                  overflowY: 'auto',
                  ...styles?.sidebarContent,
                }}
              >
                {children}
              </Flexbox>
            </>
          ) : (
            children
          )}
        </Flexbox>
      </AntdDrawer>
    );
  },
);

export default Drawer;
