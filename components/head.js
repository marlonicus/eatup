import Head from "next/head"

export default () => (
  <Head>
    <title>Eatup | Free pizza finder</title>
    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    
    {/* Some plug and play CSS framework, so it doesn't look like I pulled the page straight out of my ass */}
    <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic" />
    <link rel="stylesheet" href="//cdn.rawgit.com/necolas/normalize.css/master/normalize.css" />
    <link rel="stylesheet" href="//cdn.rawgit.com/milligram/milligram/master/dist/milligram.min.css" />
    
    {/* GDPR YOLO */}
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