import { Helmet } from 'dumi';
import { memo } from 'react';

const Favicons = memo(() => {
  return (
    <Helmet>
      <link
        href="https://npm.elemecdn.com/@lobehub/assets-favicons/assets/apple-touch-icon.png"
        rel="apple-touch-icon"
        sizes="180x180"
      />
      <link
        href="https://npm.elemecdn.com/@lobehub/assets-favicons/assets/favicon-32x32.png"
        rel="icon"
        sizes="32x32"
        type="image/png"
      />
      <link
        href="https://npm.elemecdn.com/@lobehub/assets-favicons/assets/favicon-16x16.png"
        rel="icon"
        sizes="16x16"
        type="image/png"
      />
      <link
        href="https://npm.elemecdn.com/@lobehub/assets-favicons/assets/site.webmanifest"
        rel="manifest"
      />
      <link
        color="#000000"
        href="https://npm.elemecdn.com/@lobehub/assets-favicons/assets/safari-pinned-tab.svg"
        rel="mask-icon"
      />
      <meta content="LobeHub" name="apple-mobile-web-app-title" />
      <meta content="LobeHub" name="application-name" />
      <meta content="#000000" name="msapplication-TileColor" />
      <meta content="#000000" name="theme-color" />
    </Helmet>
  );
});

export default Favicons;
