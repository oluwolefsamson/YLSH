import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <meta name="theme-color" content="#fbfbfb" />
          <meta name="msapplication-navbutton-color" content="#fbfbfb" />
          <meta name="apple-mobile-web-app-status-bar-style" content="#fbfbfb" />
          <meta name="mobile-web-app-capable" content="yes" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Cabin:ital,wght@0,400;0,500;0,700;1,500;1,700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
