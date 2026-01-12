import Script from 'next/script'

type Props = {
  gaId: string
}

export const GoogleAnalytics = ({ gaId }: Props) => (
  <>
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      strategy="lazyOnload"
    />
    <Script
      id="ga4-init"
      strategy="lazyOnload"
      dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `,
      }}
    />
  </>
)
