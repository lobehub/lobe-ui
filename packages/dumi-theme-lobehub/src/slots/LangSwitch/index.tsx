import { Button } from 'antd';
import { history, Link, useLocation, useSiteData } from 'dumi';
import { memo, useEffect, useState, type FC } from 'react';

import NativeSelect from '../../components/NativeSelect';
import { useSiteStore } from '../../store';

type ILocaleItem = ReturnType<typeof useSiteData>['locales'][0];

function getTargetLocalePath({
  pathname,
  current,
  target,
}: {
  pathname: string;
  current: ILocaleItem;
  target: ILocaleItem;
}) {
  const clearPath =
    'base' in current
      ? // handle '/en-US/a' => '/a' or '/en-US' => '' => '/'
        pathname.replace(current.base.replace(/\/$/, ''), '') || '/'
      : pathname.replace(new RegExp(`${current.suffix}$`), '');

  return 'base' in target
    ? `${
        // for `/` base, strip duplicated leading slash
        target.base.replace(/\/$/, '')
      }${clearPath}`
        // for `/` clearPath, strip duplicated ending slash
        .replace(/([^/])\/$/, '$1')
    : `${clearPath}${target.suffix}`;
}

const languageMap: Record<string, string> = {
  'zh-CN': '🇨🇳',
  'en-US': '🇺🇸',
  'jp-JP': '🇯🇵',
  'ko-KR': '🇰🇷',
  'ru-RU': '🇷🇺',
  'es-ES': '🇪🇸',
  'fr-FR': '🇫🇷',
  'de-DE': '🇩🇪',
  'pt-BR': '🇧🇷',
  'it-IT': '🇮🇹',
  'tr-TR': '🇹🇷',
  'vi-VN': '🇻🇳',
};

const displayLangMap: Record<string, string> = {
  'zh-CN': '中',
  'en-US': 'EN',
};

const SingleSwitch: FC<{ locale: ILocaleItem; current: ILocaleItem }> = ({ locale, current }) => {
  const { pathname } = useLocation();
  const [path, setPath] = useState(() =>
    getTargetLocalePath({ pathname, current, target: locale }),
  );

  useEffect(() => {
    setPath(getTargetLocalePath({ pathname, current, target: locale }));
  }, [pathname, current.id, locale.id]);

  return (
    <Link to={path}>
      <Button
        style={{
          minWidth: 34,
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {displayLangMap[locale.id]}
      </Button>
    </Link>
  );
};

const LangSwitch: FC = () => {
  const locales = useSiteStore((s) => s.siteData.locales);
  const current = useSiteStore((s) => s.locale);

  // do not render in single language
  if (locales.length <= 1) return null;

  return locales.length > 2 ? (
    <NativeSelect
      value={locales.findIndex((l) => l.id === current.id)}
      onChange={(index) => {
        console.log(
          getTargetLocalePath({
            pathname: location.pathname,
            current,
            target: locales[index],
          }),
        );

        history.push(
          getTargetLocalePath({
            pathname: location.pathname,
            current,
            target: locales[index],
          }),
        );
      }}
      options={locales.map((item) => ({
        value: item.id,
        label: displayLangMap[item.id],
      }))}
      renderItem={(item, index) => `${languageMap[locales[index].id]} ${locales[index].name}`}
      style={{
        height: 32,
        minWidth: 32,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />
  ) : (
    // single language switch
    <SingleSwitch locale={locales.find(({ id }) => id !== current.id)!} current={current} />
  );
};

export default memo(LangSwitch);
