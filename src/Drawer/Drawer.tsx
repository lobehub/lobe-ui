'use client';

import { Drawer as AntdDrawer } from 'antd';
import { cssVar } from 'antd-style';
import { XIcon } from 'lucide-react';
import { type CSSProperties, memo, useMemo } from 'react';

import ActionIcon from '@/ActionIcon';
import { Flexbox } from '@/Flex';

import type { DrawerProps } from './type';

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
    ref,
    ...rest
  }) => {
    const headerBorder: CSSProperties = useMemo(() => {
      if (height === '100%' || width === '100%' || height === '100vh' || width === '100vw')
        return {};

      switch (placement) {
        case 'top': {
          return {
            borderBottom: `1px solid ${cssVar.colorBorder}`,
          };
        }
        case 'bottom': {
          return {
            borderTop: `1px solid ${cssVar.colorBorder}`,
          };
        }
        case 'left': {
          return {
            borderRight: `1px solid ${cssVar.colorBorder}`,
          };
        }
        case 'right': {
          return {
            borderLeft: `1px solid ${cssVar.colorBorder}`,
          };
        }
        default: {
          return {};
        }
      }
    }, [placement, height, width]);

    const extraNode = (
      <Flexbox
        horizontal
        align={'center'}
        className={classNames?.extra}
        gap={4}
        justify={'flex-end'}
        style={{
          position: 'absolute',
          right: 4,
          top: 4,
          ...styles?.extra,
        }}
      >
        {extra}
        {closeIcon || <ActionIcon icon={XIcon} onClick={onClose} {...closeIconProps} />}
      </Flexbox>
    );

    const sidebarContent = (
      <>
        <Flexbox
          className={classNames?.sidebar}
          paddingBlock={12}
          paddingInline={16}
          width={sidebarWidth}
          style={{
            background: cssVar.colorBgLayout,
            borderRight: `1px solid ${cssVar.colorBorderSecondary}`,
            height: '100vh',
            overflowX: 'hidden',
            overflowY: 'auto',
            position: 'sticky',
            top: 0,
            ...styles?.sidebar,
          }}
        >
          {sidebar}
        </Flexbox>
        <Flexbox
          className={classNames?.sidebarContent}
          flex={1}
          paddingBlock={12}
          paddingInline={16}
          style={{
            background: cssVar.colorBgContainer,
            overflowX: 'hidden',
            overflowY: 'auto',
            ...styles?.sidebarContent,
          }}
        >
          {children}
        </Flexbox>
      </>
    );

    return (
      <AntdDrawer
        classNames={classNames}
        closable={false}
        extra={noHeader ? undefined : extraNode}
        height={height}
        keyboard={true}
        panelRef={ref}
        placement={placement}
        width={width}
        styles={
          typeof styles === 'function'
            ? styles
            : {
                ...styles,
                body: {
                  background: 'transparent',
                  paddingBlock: sidebar ? 0 : 12,
                  paddingInline: sidebar ? 0 : 16,
                  ...styles?.body,
                },
                header: {
                  background: 'transparent',
                  display: noHeader ? 'none' : undefined,
                  padding: 4,
                  ...styles?.header,
                },
                section: {
                  background: sidebar
                    ? `linear-gradient(to right, ${cssVar.colorBgLayout} 49.9%, ${cssVar.colorBgContainer} 50%)`
                    : cssVar.colorBgContainer,
                  ...styles?.section,
                },
                wrapper: {
                  background: cssVar.colorBgContainer,
                  ...headerBorder,
                  ...styles?.wrapper,
                },
              }
        }
        title={
          <Flexbox
            horizontal
            align={'center'}
            className={classNames?.title}
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
        onClose={onClose}
        {...rest}
      >
        <Flexbox
          className={classNames?.bodyContent}
          horizontal={!!sidebar}
          style={{
            justifySelf: 'center',
            maxWidth: containerMaxWidth,
            minHeight: '100%',
            overflow: sidebar ? 'visible' : undefined,
            width: '100%',
            ...styles?.bodyContent,
          }}
        >
          {noHeader && extraNode}
          {sidebar ? sidebarContent : children}
        </Flexbox>
      </AntdDrawer>
    );
  },
);

Drawer.displayName = 'Drawer';

export default Drawer;
