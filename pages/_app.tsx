import '../styles/globals.css'
import '../styles/portfolio.css'
import Head from 'next/head'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  const useV2Font = process.env.NEXT_PUBLIC_USE_V2_FONT === 'true'

  return (
    <div
      className={`font-body-theme ${
        useV2Font ? 'font-theme-v2' : 'font-theme-default'
      }`}
    >
      <Head><link rel="icon" href="/favicon.svg" type="image/svg+xml" /></Head>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
