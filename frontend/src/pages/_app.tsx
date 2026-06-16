import React, { FC } from 'react'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import { Toaster } from 'sonner'
import ReactQueryProvider from '@/providers/react-query-provider'
import { NextPageWithLayout } from '@/interfaces/layout'
import 'slick-carousel/slick/slick.css'
import '@/styles/globals.css'
import '@/styles/react-slick.css'

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const App: FC<AppPropsWithLayout> = ({ Component, pageProps }) => {
  const getLayout = Component.getLayout || ((page) => page)

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>YLSH Enterprise</title>
      </Head>
      <ReactQueryProvider>
        {getLayout(<Component {...pageProps} />)}
        <Toaster richColors position="top-right" />
      </ReactQueryProvider>
    </>
  )
}

export default App
