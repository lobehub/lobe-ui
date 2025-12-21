'use client';

import { type ReactNode, memo, useMemo } from 'react';

import A from '@/A';
import Block from '@/Block';
import { Flexbox } from '@/Flex';
import Text from '@/Text';

import SearchResultCards from './SearchResultCards';

interface FootnotesProps {
  'children': ReactNode;
  'data-footnote-links'?: string;
  'data-footnotes'?: boolean;
}

const DefaultFootnotes = memo<{ dataSource: any[] }>(({ dataSource }) => {
  const items = useMemo(
    () =>
      dataSource
        .find((child) => child?.type === 'ol')
        ?.props?.children?.map((item: any) => {
          if (typeof item === 'string' || item?.type !== 'li') return false;
          const data = item?.props?.children?.find((note: any) => note?.props?.children)?.props
            ?.children;
          if (!data || !Array.isArray(data)) return false;
          return {
            children: data[0],
            props: data[1]?.props || {},
          };
        })
        .filter(Boolean),
    [dataSource],
  );

  if (!Array.isArray(items)) return null;

  return (
    <Flexbox
      align={'flex-start'}
      as={'section'}
      className={'footnotes'}
      data-footnotes="true"
      gap={'0.5em'}
      horizontal
      justify={'flex-start'}
      wrap={'wrap'}
    >
      {items.map(({ children, props }, index) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { node, href, ...rest } = props;
        const Container = href ? A : 'div';
        return (
          <Container {...(href ? { href, ...rest } : rest)} key={index}>
            <Block
              align={'stretch'}
              horizontal
              style={{ overflow: 'hidden', position: 'relative' }}
              variant={'outlined'}
            >
              <Block paddingInline={'0.66em'} style={{ borderRadius: 0 }} variant={'filled'}>
                <Text as="span" code type={'secondary'}>
                  {index + 1}
                </Text>
              </Block>
              <Text as="span" style={{ paddingInline: '0.66em' }} type={'secondary'}>
                {children}
              </Text>
            </Block>
          </Container>
        );
      })}
    </Flexbox>
  );
});

const Footnotes = memo<FootnotesProps>(({ children, ...rest }) => {
  const links = useMemo(() => {
    try {
      return JSON.parse(rest['data-footnote-links'] || '[]');
    } catch (error) {
      console.error('Failed to parse footnote links:', error);
      return [];
    }
  }, [rest['data-footnote-links']]);

  const isError = links.length === 0;

  if (!children) return;

  if (isError) {
    if (!Array.isArray(children)) return children;
    return <DefaultFootnotes dataSource={children} />;
  }

  return (
    <section className={'footnotes'} data-footnotes="true">
      <SearchResultCards dataSource={links} />
    </section>
  );
});

Footnotes.displayName = 'Footnotes';

export default Footnotes;
