import React, { FC, useState } from 'react'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { Toaster } from 'sonner'
import ReactQueryProvider from '@/providers/react-query-provider'
import { AuthProvider } from '@/contexts/AuthContext'
import { NextPageWithLayout } from '@/interfaces/layout'
import 'slick-carousel/slick/slick.css'
import '@/styles/globals.css'
import '@/styles/react-slick.css'

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const ChatWidget: FC = () => {
  const [open, setOpen] = useState(false)

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '12px',
        width: 'min(380px, calc(100vw - 32px))',
      }}
    >
      {open && (
        <div
          style={{
            width: '100%',
            height: 'min(640px, calc(100vh - 120px))',
            borderRadius: '20px',
            overflow: 'hidden',
            background: '#fff',
            boxShadow: '0px 16px 48px rgba(0,0,0,0.28)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              flex: '0 0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              background: '#082F49',
              color: '#fff',
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: 700 }}>Chat Assistant</div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              style={{
                appearance: 'none',
                background: 'transparent',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                lineHeight: 1,
                padding: 0,
              }}
            >
              Close
            </button>
          </div>
          <iframe
            src="https://app.chatsimple.ai/iframe23/50175e0b-a141-4531-be7f-ee09a997ac88/acc23e0a-e003-4b52-81e4-afcd7a5253e0/3cfb0e03-a23e-4dc4-bf64-7b985bbe0e58"
            title="Chatsimple"
            style={{ width: '100%', height: '100%', border: 'none', display: 'block', flex: '1 1 auto' }}
          />
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#082F49',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0px 4px 16px rgba(0,0,0,0.3)',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {open ? 'Close' : 'Chat'}
      </button>
    </div>
  )
}

const App: FC<AppPropsWithLayout> = ({ Component, pageProps }) => {
  const getLayout = Component.getLayout || ((page) => page)
  const router = useRouter()

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>YLSH Enterprise</title>
      </Head>
      <ReactQueryProvider>
        <AuthProvider>
          {getLayout(<Component {...pageProps} />)}
          <Toaster richColors position="top-right" />
          {router.pathname === '/' && <ChatWidget />}
        </AuthProvider>
      </ReactQueryProvider>
    </>
  )
}

export default App
