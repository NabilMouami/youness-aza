import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          {/* Preload fonts */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Mrs+Saint+Delafield&family=Tenor+Sans&display=swap"
            rel="stylesheet"
          />

          {/* Favicon */}
          <link rel="icon" href="/logo.webp" />

          {/* SEO Meta Tags */}
          <meta name="description" content="Your website description here" />
          <meta property="og:title" content="Your Website Title" />
          <meta
            property="og:description"
            content="Your website description here"
          />
          <meta property="og:image" content="/logo.webp" />
          <meta property="og:url" content="https://yourwebsite.com" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Your Website Title" />
          <meta
            name="twitter:description"
            content="Your website description here"
          />
          <meta name="twitter:image" content="/upload/your-image.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
