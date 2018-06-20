import Head from "next/head"

export default () => (
  <Head>
    <title>Eatup | Free pizza finder</title>
    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-121075359-1"></script>
    <script dangerouslySetInnerHTML={{
      __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'UA-121075359-1');
      `
    }} />
  </Head>
)